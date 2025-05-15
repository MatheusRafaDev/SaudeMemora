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

export async function processarReceitaComImagem2(textoOCR, paciente, documentoId, imagem) {
  try {
    // Processa o OCR para receita
    const receitaJSON = await tratarOCRParaReceitas(textoOCR);
    if (receitaJSON.error) throw new Error(`Erro no OCR da receita: ${receitaJSON.error}`);

    // Verifica se os medicamentos foram extraídos do OCR
    const medicamentos = receitaJSON.medicamentos || [];
    if (!Array.isArray(medicamentos) || medicamentos.length === 0) {
      throw new Error("Nenhum medicamento foi encontrado no OCR.");
    }

    // Monta os dados da receita
    const receitaData = {
      medico: receitaJSON.medico || "Médico não informado",
      crmMedico: receitaJSON.crm || "CRM não informado",
      posologia: receitaJSON.posologia || "Posologia não informada",
      observacoes: receitaJSON.observacoes || "Sem observações",
      resumo: receitaJSON.resumo || textoOCR || "Sem resumo",
      dataReceita: receitaJSON.dataReceita || null,
      paciente: { id: paciente.id },
      documento: { id: documentoId },
      medicamentos: medicamentos.map((medicamento) => ({
        nome: medicamento.nome || "Medicamento não informado",
        quantidade: medicamento.quantidade || 0,
        formaDeUso: medicamento.formaDeUso || "Uso não informado"
      }))
    };

    // Cria o FormData para enviar a imagem e os dados da receita
    const formData = new FormData();
    formData.append("receitaData", JSON.stringify(receitaData));
    formData.append("imagem", imagem);

    // Envia a receita para o serviço
    const response = await ReceitaService.createWithImage(formData);

    console.log("Resposta do serviço de receita:", response);
    return { success: true, message: "Receita incluída com sucesso!", data: response };
  } catch (error) {
    // Retorna erro caso algo dê errado no processo
    return { success: false, message: error.message };
  }
}

export async function processarReceitaComImagem(textoOCR, paciente, documentoId, imagem, navigate) {
  try {
    const receitaJSON = await tratarOCRParaReceitas(textoOCR);
    if (receitaJSON.error) throw new Error(`Erro no OCR da receita: ${receitaJSON.error}`);

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
      dataReceita: receitaJSON.dataReceita || null,
      paciente: { id: paciente.id },
      documento: { id: documentoId },
      medicamentos: medicamentos.map((medicamento) => ({
        nome: medicamento.nome || "Medicamento não informado",
        quantidade: medicamento.quantidade || 0,
        formaDeUso: medicamento.formaDeUso || "Uso não informado"
      }))
    };

    console.log("Dados da receita:", receitaData);
    const formData = new FormData();
    formData.append("receitaData", JSON.stringify(receitaData));
    formData.append("imagem", imagem);

    // Faz o envio e recebe a resposta da API
    const response = await ReceitaService.createWithImage(formData);
    const receitaSalva = response.data;

    // Monta objeto para tela de visualização
    const documentoVisualizacao = {
      data: receitaSalva.dataReceita || "-",
      medico: receitaSalva.medico || "-",
      medicamento: (receitaSalva.medicamentos || []).map(m => m.nome).join(", "),
      dosagem: receitaSalva.posologia || "-",
      notas: receitaSalva.observacoes || "-",
      imagem: URL.createObjectURL(imagem),
      textoExtraido: receitaSalva.resumo || "-"
    };

    navigate("/visualizar-documento", { state: { documento: documentoVisualizacao } });

    return { success: true, message: "Receita incluída com sucesso!", data: receitaSalva };
  } catch (error) {
    return { success: false, message: error.message };
  }
}



// Função para processar o tipo "Exame"
export async function processarExame(textoOCR, paciente, documentoId) {
  try {
    const exameJSON = await tratarOCRParaExames(textoOCR);
    if (exameJSON.error) throw new Error(`Erro no OCR do exame: ${exameJSON.error}`);

  const exameData = {
    nomeExame: exameJSON.nomeExame || exameJSON.tipo || "Exame importado via OCR",
    tipo: exameJSON.tipo || "Tipo não informado",
    data: exameJSON.data || new Date().toISOString().split("T")[0], // formato yyyy-mm-dd
    laboratorio: exameJSON.laboratorio || "Laboratório não informado",
    resultado: exameJSON.resultado || textoOCR || "Resultado não informado",
    observacoes: exameJSON.observacoes || "Sem observações",
    resumo: exameJSON.resumo || "Sem resumo",
    imagem: "", // ou base64/URL se disponível
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
      data: prontuarioJSON.data || new Date().toISOString().split("T")[0],
      medico: prontuarioJSON.medico || "Médico não informado",
      especialidade: prontuarioJSON.especialidade || "Especialidade não informada",
      observacoes: prontuarioJSON.observacoes || "Sem observações",
      conclusoes: prontuarioJSON.conclusoes || "Sem conclusões",
      resumo: prontuarioJSON.resumo || textoOCR || "Sem resumo",
      conteudo: prontuarioJSON.conteudo || textoOCR || "Sem conteúdo original",
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
