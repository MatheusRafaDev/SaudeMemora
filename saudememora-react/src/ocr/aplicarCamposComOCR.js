import { processarFormularioMedico } from "../services/OpenRouter";

export async function aplicarCamposComOCR(
  textoOCR,
  perguntas,
  setRespostas,
  ocrExecutado
) {
  if (!ocrExecutado || !textoOCR) {
    console.warn("OCR não executado ou texto vazio");
    return;
  }

  try {

    const jsonExtraido = await processarFormularioMedico(textoOCR);

    // Mapeamento de campos antigos para novos (se necessário)
    const mapeamentoCampos = {
      "cardiaco": "cardio",
      "hemorragico": "hemorragicos",
      "alergia_medicamentos": "alergia_medicamento"
    };

    const novasRespostas = {};
    const valoresPressaoValidos = ["NORMAL", "ALTA", "BAIXA"];

    perguntas.forEach((pergunta) => {
      const chave = pergunta.chave;
      
      // Verifica se há mapeamento para o campo
      const chaveOrigem = mapeamentoCampos[chave] || chave;
      
      let valor = jsonExtraido[chaveOrigem];

      // Tratamento padrão para valores não definidos
      if (valor === undefined || valor === null) {
        novasRespostas[chave] = pergunta.tipo === "pressao" ? "" : "NAO";
        return;
      }

      // Padronização do valor
      valor = valor.toString().trim().toUpperCase()
        .replace("NÃO", "NAO")
        .replace("NAO", "NAO")
        .replace("SIM", "SIM");

      // Tratamento especial para pressão arterial
      if (pergunta.tipo === "pressao") {
        // Encontra o valor mais próximo (para lidar com variações como "ALTAMENTE" -> "ALTA")
        const valorPressao = valoresPressaoValidos.find(v => 
          valor.includes(v) || v.includes(valor)
        );
        novasRespostas[chave] = valorPressao || "";
      } 
      // Tratamento para campos SIM/NAO
      else {
        novasRespostas[chave] = valor === "SIM" ? "SIM" : "NAO";
        
        // Se for SIM e houver campo extra no OCR, preenche
        if (valor === "SIM" && jsonExtraido[`${chaveOrigem}_detalhe`]) {
          novasRespostas[`${chave}_extra`] = jsonExtraido[`${chaveOrigem}_detalhe`];
        }
      }
    });

    // Atualiza o estado das respostas preservando valores existentes
    setRespostas(prevRespostas => ({
      ...prevRespostas,
      ...novasRespostas
    }));

  } catch (error) {
    console.error("Erro ao aplicar campos com OCR:", error);
    throw new Error("Falha ao processar OCR. Verifique o formato do texto.");
  }
}
