function processarTexto(texto) {
  const linhas = texto.split("\n");
  const resultados = [];
  let linhaPressao = "";

  linhas.forEach(linha => {
    const [pergunta, resposta] = linha.split("?");

    if (!resposta) {
      // Trata linha de pressão arterial
      if (linha.includes("Pressão arterial")) {
        linhaPressao = "Pressão arterial: NORMAL: (X)  ALTA: ( )  BAIXA: ( )";
      }
      // Ignora outras linhas sem "?"
      return;
    }

    // Ignora se a linha não tiver nenhum parêntese ()
    if (!linha.includes("(")) return;

    let sim = " ";
    let nao = " ";

    if (/SIM.*[^()\s]+.*NÃO/.test(resposta)) {
      sim = "X";
    } else if (/SIMPS/.test(resposta)) {
      sim = "X";
    } else if (/\bSIM\s*\(\s*\)/.test(resposta)) {
      nao = "X";
    } else if (/NÃO.*[A-Za-z?*)]/.test(resposta)) {
      nao = "X";
    } else if (/SIM.*[XOB*]/.test(resposta)) {
      sim = "X";
    }

    resultados.push(`${pergunta.trim()}? SIM: (${sim})  NÃO: (${nao})`);
  });

  return [...resultados, linhaPressao].filter(Boolean).join("\n");
}


export default function getParsedText(data) {
  const results = data?.ParsedResults;
  if (!results) return '';
  return results.map(r => r?.ParsedText).join('\n').trim();
}
