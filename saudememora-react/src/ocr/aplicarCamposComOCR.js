import { remove as removeAcentos } from 'diacritics';

export const aplicarCamposComOCR = (textoOCR, perguntas, setRespostas, ocrExecutado) => {
  if (!ocrExecutado || !textoOCR) return;

  const respostasExtraidas = {};
  const linhas = textoOCR.split('\n').filter(l => l.includes('(')); // ignora linhas sem ()

  const normalizar = texto => removeAcentos(texto).toLowerCase().replace(/[^a-z0-9\s]/gi, '');

  perguntas.forEach(pergunta => {
    const perguntaNormalizada = normalizar(pergunta.pergunta);
    const palavrasChave = perguntaNormalizada.split(/\s+/).filter(p => p.length > 2); // ignora preposições curtas

    for (const linha of linhas) {
      const linhaNormalizada = normalizar(linha);

      // Verifica se a linha contém todas as palavras-chave
      const similar = palavrasChave.every(palavra => linhaNormalizada.includes(palavra));

      // Se houver uma correspondência, marca a resposta
      if (similar) {
        const simMarcado = /\bSIM\s*:\s*\(\s*X\s*\)/i.test(linha);
        const naoMarcado = /\bN[ÃA]O\s*:\s*\(\s*X\s*\)/i.test(linha);

        if (simMarcado) respostasExtraidas[pergunta.chave] = 'SIM';
        else if (naoMarcado) respostasExtraidas[pergunta.chave] = 'NAO';
        break;
      }
    }

    // Tratamento especial para Pressão arterial
    if (pergunta.tipo === 'pressao') {
      const match = textoOCR.match(/Press[aã]o arterial:.*?NORMAL:\s*\(\s*X?\s*\).*?ALTA:\s*\(\s*X?\s*\).*?BAIXA:\s*\(\s*X?\s*\)/i);
      if (match) {
        if (/NORMAL:\s*\(\s*X\s*\)/i.test(match[0])) respostasExtraidas['pressao'] = 'NORMAL';
        else if (/ALTA:\s*\(\s*X\s*\)/i.test(match[0])) respostasExtraidas['pressao'] = 'ALTA';
        else if (/BAIXA:\s*\(\s*X\s*\)/i.test(match[0])) respostasExtraidas['pressao'] = 'BAIXA';
      }
    }
  });

  setRespostas(respostasExtraidas);
};
