import { ajustarTextoFormulario, ajustarDadosMedicos, ajustarJSON } from "../services/OpenRouter";

export async function aplicarCamposComOCR(
  textoOCR,
  perguntas,
  setRespostas,
  setMensagem 
) {
  if (!textoOCR || textoOCR.trim() === "") {
    setMensagem("Nenhum texto OCR disponível para processar");
    return;
  }

  try {
    setMensagem("Processando dados médicos...");
    
    // 1. Processa os dados médicos brutos
    const dadosMedicos = await ajustarDadosMedicos(textoOCR);
    if (!dadosMedicos) {
      throw new Error("Falha ao processar dados médicos");
    }

    // 2. Ajusta para o formato do formulário
    const resultadoFormatado = await ajustarTextoFormulario(dadosMedicos);
    if (!resultadoFormatado) {
      throw new Error("Falha ao formatar dados para o formulário");
    }

    // 3. Converte para JSON estruturado
    const jsonRespostas = await ajustarJSON(resultadoFormatado);
    if (!jsonRespostas) {
      throw new Error("Falha ao converter para JSON");
    }

    // Mapeia as respostas para o formato esperado pelo estado
    const novasRespostas = {};

    perguntas.forEach((pergunta) => {
      const chave = pergunta.chave;
      let valor = jsonRespostas[chave];

      // Tratamento padrão para valores não encontrados
      if (valor === undefined || valor === null) {
        valor = pergunta.tipo === "pressao" ? "" : "NAO";
      } else {
        // Normaliza o valor
        valor = valor.toString().trim().toUpperCase();
        valor = valor.replace("NÃO", "NAO");
        
        // Validação específica para pressão arterial
        if (pergunta.tipo === "pressao") {
          if (!["NORMAL", "ALTA", "BAIXA"].includes(valor)) {
            valor = "";
          }
        }
      }

      novasRespostas[chave] = valor;
      
      // Limpa campos extras se a resposta for NÃO
      if (pergunta.mostrarExtra && valor === "NAO") {
        novasRespostas[`${chave}_extra`] = "";
      }
    });

    // Atualiza o estado com as novas respostas
    setRespostas(prev => ({ ...prev, ...novasRespostas }));
    setMensagem("Campos preenchidos com sucesso!");

  } catch (error) {
    console.error("Erro ao aplicar campos com OCR:", error);
    setMensagem(`Erro ao processar OCR: ${error.message}`);
  }
}