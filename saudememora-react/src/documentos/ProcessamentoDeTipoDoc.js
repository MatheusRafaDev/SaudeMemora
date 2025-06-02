import ReceitaService from "../services/ReceitaService";
import ExameService from "../services/ExameService";
import DocumentoClinicoService from "../services/DocumentoClinicoService";

import {
  tratarOCRParaReceitas,
  tratarOCRParaExames,
  tratarOCRParaDocumentoClinico,
} from "../services/OpenRouter";

export async function processarReceitaComImagem(
  textoOCR,
  paciente,
  documentoId,
  imagem,
  navigate,
  medicamentos // array com { nome, quantidade, formaDeUso }
) {
  try {
    const receitaJSON = await tratarOCRParaReceitas(textoOCR);

    // Usa só o array de medicamentos recebido
    const medicamentosFinal = Array.isArray(medicamentos) ? medicamentos : [];

    const receitaData = {
      medico: receitaJSON.medico || "",
      crmMedico: receitaJSON.crm || "",
      observacoes: receitaJSON.observacoes || "",
      resumo: receitaJSON.resumo || "",
      dataReceita:receitaJSON.dataReceita || new Date().toISOString().split("T")[0],
      paciente: { id: paciente.id },
      documento: { id: documentoId },
      medicamentos: medicamentosFinal,
    };

    const formData = new FormData();
    formData.append("receitaData", JSON.stringify(receitaData));
    formData.append("imagem", imagem);

    const response = await ReceitaService.createWithImage(formData);
    const receitaSalva = response.data;

    const receitaResponse = await ReceitaService.getReceitaByDocumentoId(
      documentoId
    );
    const documentoDados = receitaResponse.data;

    navigate("/visualizar-documento", {
      state: { documento: documentoDados, tipo: "R" },
    });

    return {
      success: true,
      message: "Receita incluída com sucesso!",
      data: receitaSalva,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}


export async function processarExameComImagem(
  textoOCR,
  paciente,
  documentoId,
  imagem,
  navigate
) {
  try {
    const exameJSON = await tratarOCRParaExames(textoOCR);
    if (exameJSON.error)
      throw new Error(`Erro no OCR do exame: ${exameJSON.error}`);

    const exameData = {
      nomeExame: exameJSON.nomeExame || "",
      tipo: exameJSON.tipo || "",
      dataExame: exameJSON.dataExame || new Date().toISOString().split("T")[0],
      laboratorio: exameJSON.laboratorio || "",
      resultado: exameJSON.resultado || textoOCR || "",
      observacoes: exameJSON.observacoes || "",
      resumo: exameJSON.resumo || textoOCR || "",
      paciente: { id: paciente.id },
      documento: { id: documentoId },
    };

    const formData = new FormData();
    formData.append("exameData", JSON.stringify(exameData));
    formData.append("imagem", imagem);

    const response = await ExameService.createWithImage(formData);

    const exameSalvo = response.data;

    let documentoDados;
    const receitaResponse = await ExameService.getExameByDocumentoId(
      documentoId
    );
    documentoDados = receitaResponse.data;

    navigate("/visualizar-documento", {
      state: { documento: documentoDados, tipo: "E" },
    });

    return {
      success: true,
      message: "Exame incluído com sucesso!",
      data: exameSalvo,
    };
  } catch (error) {
    return {
      success: false,
      message: `Erro ao processar o exame: ${error.message}`,
    };
  }
}

export async function processarDocumentoClinicoComImagem(
  textoOCR,
  paciente,
  documentoId,
  imagem,
  navigate
) {
  try {
    const documentoJSON = await tratarOCRParaDocumentoClinico(textoOCR);

    if (documentoJSON.error)
      throw new Error(
        `Erro no OCR do documento clínico: ${documentoJSON.error}`
      );

    const documentoData = {
      dataDocumentoCli: documentoJSON.dataDocumentoCli,
      medico: documentoJSON.medico || "",
      especialidade: documentoJSON.especialidade || "",
      observacoes: documentoJSON.observacoes || "",
      conclusoes: documentoJSON.conclusoes || "",
      resumo: documentoJSON.resumo || "",
      conteudo: documentoJSON.conteudo || textoOCR || "",
      tipo: documentoJSON.tipo ||  "",
      paciente: { id: paciente.id },
      documento: { id: documentoId },
    };

    const formData = new FormData();
    formData.append("documentoData", JSON.stringify(documentoData));
    formData.append("imagem", imagem);

    let documentoDados;

    const response = await DocumentoClinicoService.create(formData);
    documentoDados = response.data;

    navigate("/visualizar-documento", {
      state: { documento: documentoDados, tipo: "D" },
    });

    if (response?.success)
      return {
        success: true,
        message: "Documento clínico incluído com sucesso!",
      };

    throw new Error(
      response?.message || "Erro ao incluir o documento clínico."
    );
  } catch (error) {
    throw new Error(`Erro ao processar o documento clínico: ${error.message}`);
  }
}
