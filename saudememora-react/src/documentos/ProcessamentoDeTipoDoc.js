import ReceitaService from "../services/ReceitaService";
import ExameService from "../services/ExameService";
import ProntuarioService from "../services/ProntuarioService";

import {
  tratarOCRParaReceitas,
  tratarOCRParaExames,
  tratarOCRParaProntuarios,
} from "../services/OpenRouter";

export async function processarReceitaComImagem(
  textoOCR,
  paciente,
  documentoId,
  imagem,
  navigate
) {
  try {
    const receitaJSON = await tratarOCRParaReceitas(textoOCR);
    if (receitaJSON.error)
      throw new Error(`Erro no OCR da receita: ${receitaJSON.error}`);

    const medicamentos = receitaJSON.medicamentos || [];
    if (!Array.isArray(medicamentos) || medicamentos.length === 0) {
      throw new Error("Nenhum medicamento foi encontrado no OCR.");
    }

    const receitaData = {
      medico: receitaJSON.medico || "Médico não informado",
      crmMedico: receitaJSON.crm || "CRM não informado",
      posologia: receitaJSON.posologia || "Posologia não informada",
      observacoes: receitaJSON.observacoes || "Sem observações",
      resumo: receitaJSON.resumo || textoOCR || "Sem resumo",
      dataReceita:
        receitaJSON.dataReceita || new Date().toISOString().split("T")[0],
      paciente: { id: paciente.id },
      documento: { id: documentoId },
      medicamentos: medicamentos.map((medicamento) => ({
        nome: medicamento.nome || "Medicamento não informado",
        quantidade: medicamento.quantidade || 0,
        formaDeUso: medicamento.formaDeUso || "Uso não informado",
      })),
    };


    const formData = new FormData();
    formData.append("receitaData", JSON.stringify(receitaData));
    formData.append("imagem", imagem);

    // Faz o envio e recebe a resposta da API
    const response = await ReceitaService.createWithImage(formData);
    const receitaSalva = response.data;

    let documentoDados;
    const receitaResponse = await ReceitaService.getReceitaByDocumentoId(
      documentoId
    );
    documentoDados = receitaResponse.data;

    
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
      nomeExame:
        exameJSON.nomeExame || exameJSON.tipo || "Exame importado via OCR",
      tipo: exameJSON.tipo || "Tipo não informado",
      data: exameJSON.data || new Date().toISOString().split("T")[0],
      laboratorio: exameJSON.laboratorio || "Laboratório não informado",
      resultado: exameJSON.resultado || textoOCR || "Resultado não informado",
      observacoes: exameJSON.observacoes || "Sem observações",
      resumo: exameJSON.resumo || textoOCR || "Sem resumo",
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

export async function processarProntuario(textoOCR, paciente, documentoId) {
  try {
    const prontuarioJSON = await tratarOCRParaProntuarios(textoOCR);
    if (prontuarioJSON.error)
      throw new Error(`Erro no OCR do prontuário: ${prontuarioJSON.error}`);

    const prontuarioData = {
      data: prontuarioJSON.data || new Date().toISOString().split("T")[0],
      medico: prontuarioJSON.medico || "Médico não informado",
      especialidade:
        prontuarioJSON.especialidade || "Especialidade não informada",
      observacoes: prontuarioJSON.observacoes || "Sem observações",
      conclusoes: prontuarioJSON.conclusoes || "Sem conclusões",
      resumo: prontuarioJSON.resumo || textoOCR || "Sem resumo",
      conteudo: prontuarioJSON.conteudo || textoOCR || "Sem conteúdo original",
      paciente: { id: paciente.id },
      documento: { id: documentoId },
    };

    const response = await ProntuarioService.create(prontuarioData);
    if (response?.success)
      return { success: true, message: "Prontuário incluído com sucesso!" };

    throw new Error(response?.message || "Erro ao incluir o prontuário.");
  } catch (error) {
    throw new Error(`Erro ao processar o prontuário: ${error.message}`);
  }
}
