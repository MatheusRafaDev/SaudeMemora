import DocumentoService from "../services/DocumentoService";
import ReceitaService from "../services/ReceitaService";
import { tratarOCRParaReceitas } from "../services/OpenRouter";

export async function AdicionarDocumento(tipoDocumento, textoOCR, paciente) {
  try {


    if (!tipoDocumento || !textoOCR || !paciente) {
      throw new Error("Dados insuficientes para processar o documento e a receita.");
    }

    const documentoData = {
      tipoDocumento: tipoDocumento.charAt(0).toUpperCase(), 
      status: "Processado", // Status padrão
       dataUpload: new Date().toISOString().split("T")[0],
      paciente: {
        id: paciente.id, 
      }
    };


    // Faz a requisição para criar o documento
    const documentoResponse = await DocumentoService.create(documentoData);

    // Captura o ID do documento gerado
    const documentoId = documentoResponse.data?.id;
    if (!documentoId) {
      throw new Error("Erro ao criar o documento: ID não retornado.");
    }

    const receitaJSON = await tratarOCRParaReceitas(textoOCR);

    console.log(receitaJSON)
    // Verifica se houve erro no processamento do OCR
    if (receitaJSON.error) {
      throw new Error(`Erro no processamento do OCR: ${receitaJSON.error}`);
    }

    // Monta os dados da receita com o formato correto
    const receitaData = {
      medico: receitaJSON.medico,
      nomeMedicamento: receitaJSON.nomeMedicamento,
      posologia: receitaJSON.posologia,
      observacoes: receitaJSON.observacoes,
      resumo: receitaJSON.resumo,
      imagem: "",
      paciente: {
        id: paciente.id, 
      },
      documento: {
        id: documentoId, 
      },
    };

   // console.log("📋 Receita JSON gerada pelo OCR:", receitaData);

    const receitaResponse = await ReceitaService.create(receitaData);

    // Verifica se a criação da receita foi bem-sucedida
    if (receitaResponse?.success) {
      console.log("✅ Documento e Receita incluídos com sucesso!");
      return { success: true, message: "Documento e Receita incluídos com sucesso!" };
    } else {
      throw new Error(receitaResponse?.message || "Erro ao incluir a receita.");
    }
  } catch (error) {
    // Tratamento de erros
    console.error("❌ Erro ao processar e enviar os dados:", error.message);
    return { success: false, message: error.message };
  }
}
