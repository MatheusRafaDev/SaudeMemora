import ReceitaService from "../services/ReceitaService";
import ExameService from "../services/ExameService";
import ProntuarioService from "../services/ProntuarioService";
import {
  tratarOCRParaReceitas,
  tratarOCRParaExames,
  tratarOCRParaProntuarios
} from "../services/OpenRouter";

// Função para processar o tipo "Receita"
export async function processarReceita(textoOCR, paciente, documentoId) {
  try {
    const receitaJSON = await tratarOCRParaReceitas(textoOCR);
    if (receitaJSON.error) throw new Error(`Erro no OCR da receita: ${receitaJSON.error}`);

    const receitaData = {
      medico: receitaJSON.medico,
      nomeMedicamento: receitaJSON.nomeMedicamento,
      posologia: receitaJSON.posologia,
      observacoes: receitaJSON.observacoes,
      resumo: receitaJSON.resumo,
      imagem: "",
      paciente: { id: paciente.id },
      documento: { id: documentoId }
    };

    const response = await ReceitaService.create(receitaData);
    if (response?.success) return { success: true, message: "Receita incluída com sucesso!" };

    throw new Error(response?.message || "Erro ao incluir a receita.");
  } catch (error) {
    throw new Error(`Erro ao processar a receita: ${error.message}`);
  }
}

// Função para processar o tipo "Exame"
export async function processarExame(textoOCR, paciente, documentoId) {
  try {
    const exameJSON = await tratarOCRParaExames(textoOCR);
    if (exameJSON.error) throw new Error(`Erro no OCR do exame: ${exameJSON.error}`);

    const exameData = {
      nomeExame: exameJSON.nomeExame || "Exame importado via OCR",
      resultado: exameJSON.resultado || textoOCR,
      imagem: "",
      paciente: { id: paciente.id },
      documento: { id: documentoId }
    };

    const response = await ExameService.create(exameData);
    if (response?.success) return { success: true, message: "Exame incluído com sucesso!" };

    throw new Error(response?.message || "Erro ao incluir o exame.");
  } catch (error) {
    throw new Error(`Erro ao processar o exame: ${error.message}`);
  }
}

// Função para processar o tipo "Prontuário"
export async function processarProntuario(textoOCR, paciente, documentoId) {
  try {
    const prontuarioJSON = await tratarOCRParaProntuarios(textoOCR);
    if (prontuarioJSON.error) throw new Error(`Erro no OCR do prontuário: ${prontuarioJSON.error}`);

    const prontuarioData = {
      conteudo: prontuarioJSON.conteudo || textoOCR,
      paciente: { id: paciente.id },
      documento: { id: documentoId }
    };

    const response = await ProntuarioService.create(prontuarioData);
    if (response?.success) return { success: true, message: "Prontuário incluído com sucesso!" };

    throw new Error(response?.message || "Erro ao incluir o prontuário.");
  } catch (error) {
    throw new Error(`Erro ao processar o prontuário: ${error.message}`);
  }
}
