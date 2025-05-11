import { ajustarTextoFormulario, ajustarDadosMedicos, ajustarJSON } from "../services/OpenRouter";

export async function aplicarCamposComOCR(
  textoOCR,
  perguntas,
  setRespostas,
  ocrExecutado
) {
  if (!ocrExecutado || !textoOCR) return;

  try {

    //const dados_medicos = await ajustarDadosMedicos(textoOCR);
    //const resultado = await ajustarTextoFormulario(dados_medicos);
    //const json = await ajustarJSON(resultado);


    var json = {
      tratamento_medico: "não",
      gravida: "não",
      regime: "não",
      diabetes: "não",
      alergias: "não",
      reumatica: "não",
      coagulacao: "não",
      anestesia: "não",
      hepatite: "não",
      hiv: "não",
      drogas: "não",
      fumante: "não",
      pressao: "normal",
      respiratorio: "sim"
    };

    const novasRespostas = {};

    perguntas.forEach((pergunta) => {
      const chave = pergunta.chave;
      let valor = json[chave];

      if (valor !== undefined && valor !== null) {
        valor = valor.toString().trim().toUpperCase().replace("NÃO", "NAO");

        if (pergunta.tipo === "pressao") {
          if (["NORMAL", "ALTA", "BAIXA"].includes(valor)) {
            novasRespostas[chave] = valor;
          } else {
            novasRespostas[chave] = "";
          }
        } else {
          novasRespostas[chave] = valor;
        }
      } else {

        novasRespostas[chave] = pergunta.tipo === "pressao" ? "" : "NAO";
      }
    });

    setRespostas((prevRespostas) => ({
      ...prevRespostas,
      ...novasRespostas,
    }));

  } catch (error) {
    console.error("Erro ao aplicar campos com OCR:", error);
  }
}
