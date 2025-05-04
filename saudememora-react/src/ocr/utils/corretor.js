
const dicionarioMedico = {
  // diabetes
  diabets: "diabetes",
  diabetis: "diabetes",
  diabetess: "diabetes",

  // pressão
  pressao: "pressão",
  preseao: "pressão",
  presao: "pressão",
  precao: "pressão",

  // respiratórios
  resplratórios: "respiratórios",
  respiratorios: "respiratórios",
  respiratóros: "respiratórios",
  respitatorios: "respiratórios",
  respirátorio: "respiratórios",

  // cardíaco
  cardiáco: "cardíaco",
  cardiaco: "cardíaco",
  cardicaco: "cardíaco",

  // pulmões
  pulmãoes: "pulmões",
  pulmoes: "pulmões",
  pulmãis: "pulmões",

  // infecção
  infecao: "infecção",
  infecçâo: "infecção",
  infeccao: "infecção",

  // febre
  febre: "febre",
  fevre: "febre",

  // alergia
  alergía: "alergia",
  alérgia: "alergia",
  alerjia: "alergia",

  // inflamação
  inflamassão: "inflamação",
  inflamacão: "inflamação",
  inflamaçao: "inflamação",
  inflamacao: "inflamação",

  // vacina
  vacína: "vacina",
  vascina: "vacina",
  vaciná: "vacina",

  // covid
  covíd: "covid",
  covid19: "covid",

  // respiração
  respiraçao: "respiração",
  respiracão: "respiração",
  respiraçãoo: "respiração",

  // doença
  doênça: "doença",
  doençã: "doença",
  doenca: "doença",

  // saudável
  saúdavel: "saudável",
  saudavel: "saudável",
  saudevel: "saudável",

  // medicamento
  medicamnto: "medicamento",
  medicammento: "medicamento",
  medicameto: "medicamento",

  // tratamento
  tratamnto: "tratamento",
  tratamamento: "tratamento",
  tratameto: "tratamento",

  // hospitalar
  hospitlar: "hospitalar",
  hospitalár: "hospitalar",
  hospitalr: "hospitalar",

  // oxigênio
  oxigêno: "oxigênio",
  oxigenio: "oxigênio",
  oxigenío: "oxigênio",

  // cirurgia
  cirurgía: "cirurgia",
  cirurgiá: "cirurgia",
  cirugria: "cirurgia",

  // paciente
  pasiênte: "paciente",
  paciênte: "paciente",
  paciënte: "paciente",
  pasciente: "paciente"
};


export function corrigirTexto(texto) {
  if (!texto) return '';

  return texto
    .split('\n')
    .map(linha => {
      Object.entries(dicionarioMedico).forEach(([errado, certo]) => {
        const regex = new RegExp(`\\b${errado}\\b`, 'gi');
        linha = linha.replace(regex, certo);
      });
      return linha;
    })
    .join('\n');
}
