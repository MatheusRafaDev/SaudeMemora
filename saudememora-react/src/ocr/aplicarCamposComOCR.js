export function aplicarCamposComOCR(
  textoOCR,
  perguntas,
  setRespostas,
  ocrExecutado
) {
  if (!ocrExecutado || !textoOCR) return;

  const novasRespostas = {};
  const linhas = textoOCR.split("\n");

  for (const linha of linhas) {
    const normalizar = (texto) =>
      texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    for (const { chave, tipo } of perguntas) {

      const linhaNormalizada = normalizar(linha);
      const chaveNormalizada = normalizar(chave);

      if (!linhaNormalizada.includes(chaveNormalizada)) continue;

      if (tipo === "pressao") {
        if (linha.includes("NORMAL: (X)")) {
          novasRespostas[chave] = "NORMAL";
        } else if (linha.includes("ALTA: (X)")) {
          novasRespostas[chave] = "ALTA";
        } else if (linha.includes("BAIXA: (X)")) {
          novasRespostas[chave] = "BAIXA";
        }
      } else {
        const marcouSim = linha.includes("SIM: (X)");
        const marcouNao =
          linha.includes("NÃO: (X)") || linha.includes("NAO: (X)");

        if (marcouSim) {
          novasRespostas[chave] = "SIM";
        } else if (marcouNao) {
          novasRespostas[chave] = "NAO";
        }
      }
    }
  }

  setRespostas(novasRespostas);
}
