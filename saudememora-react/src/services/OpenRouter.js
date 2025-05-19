const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.error("⚠️ REACT_APP_OPENROUTER_API_KEY não definida em .env");
}

function normalizarTexto(texto) {
  if (!texto || typeof texto !== "string") return "";
  return texto
    .replace(/\s+/g, " ")                // substitui múltiplos espaços por um único espaço
    .replace(/(\.|\!|\?)\s*/g, "$1\n")  // coloca quebra de linha após . ! ?
    .trim();
}


export async function processarFormularioMedico(text) {
  if (!text || typeof text !== "string" || text.trim().length < 10) {
    throw new Error("Texto do formulário inválido ou muito curto");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
  };

  // Função auxiliar para chamada da API OpenRouter
  async function chamarOpenRouter(prompt, temperature = 0.0, timeout = 15000) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Você é um assistente especializado em formular e extrair dados médicos com precisão." },
          { role: "user", content: prompt }
        ],
        temperature,
      }),
      timeout,
    });

    if (!res.ok) throw new Error(`Erro na API: ${res.statusText}`);
    const data = await res.json();
    return data.choices[0].message.content.trim();
  }

  try {
    // 1. Pré-processar o texto para melhorar entrada
    const textoNormalizado = text.replace(/\s{2,}/g, " ").replace(/\n{2,}/g, "\n");

    // 2. Etapa de limpeza do texto
    const limparPrompt = `Extraia do texto abaixo APENAS as informações médicas relevantes, removendo:
- Cabeçalhos
- Rodapés
- Instruções
- Textos não relacionados às perguntas do formulário

Mantenha:
- As perguntas originais
- As respostas exatamente como estão, mesmo com erros
- Detalhes entre parênteses

Retorne o texto limpo, com cada pergunta e resposta em uma linha separada.

Texto original:
${textoNormalizado}`;

    const perguntasRespostasBrutas = await chamarOpenRouter(limparPrompt);

    // 3. Estruturação das perguntas e respostas
    const estruturarPrompt = `Analise o texto abaixo e:
1. Identifique claramente perguntas e respostas
2. Marque como "não" qualquer resposta vazia ou com parênteses vazios
3. Mantenha os detalhes das respostas exatamente como estão
4. Retorne o texto reorganizado com cada pergunta e resposta em uma linha separada

Exemplo de saída:
tratamento_medico: sim (quimioterapia)
gravida: não
diabetes: sim (tipo 2)

Texto original:
${perguntasRespostasBrutas}`;

    const perguntasRespostasEstruturadas = await chamarOpenRouter(estruturarPrompt, 0.0, 15000);

    // 4. Extração final em JSON
    const jsonPrompt = `
Você receberá um texto contendo respostas de um formulário médico. Sua tarefa é extrair os dados e devolver em JSON com a seguinte estrutura:

{
  "tratamento_medico": "sim/não",
  "tratamento_medico_detalhe": "motivo se houver",
  "gravida": "sim/não",
  "gravida_detalhe": "meses se houver",
  "regime": "sim/não",
  "regime_detalhe": "tipo se houver",
  "diabetes": "sim/não",
  "diabetes_detalhe": "tipo se houver",
  "alergias": "sim/não",
  "alergias_detalhe": "a que se houver",
  "reumatica": "sim/não",
  "coagulacao": "sim/não",
  "cardio": "sim/não",
  "cardio_detalhe": "qual doença se houver",
  "hemorragicos": "sim/não",
  "anestesia": "sim/não",
  "anestesia_detalhe": "qual problema se houver",
  "alergia_medicamento": "sim/não",
  "alergia_medicamento_detalhe": "qual medicamento se houver",
  "hepatite": "sim/não",
  "hepatite_detalhe": "há quanto tempo se houver",
  "hiv": "sim/não",
  "drogas": "sim/não",
  "fumante": "sim/não",
  "fumou": "sim/não",
  "pressao": "normal/alta/baixa",
  "respiratorio": "sim/não",
  "respiratorio_detalhe": "qual problema se houver",
  "doenca_familia": "sim/não",
  "doenca_familia_detalhe": "quais doenças se houver"
}

Regras:
1. Use apenas letras minúsculas (sim/não)
2. Mantenha os detalhes exatamente como estão no texto, sem correções
3. Inclua apenas os campos que existirem no texto
4. Para pressão, use apenas: normal, alta ou baixa
5. Não adicione campos que não existam no texto

Texto do formulário:
"""${perguntasRespostasEstruturadas}"""
`;

    let jsonResposta = await chamarOpenRouter(jsonPrompt, 0.1, 20000);

    // Limpar possíveis marcas de código
    jsonResposta = jsonResposta.replace(/```json/g, "").replace(/```/g, "").trim();

    // Validar e retornar JSON
    try {
      console.log("JSON Resposta:", jsonResposta);
      return JSON.parse(jsonResposta);
    } catch (e) {
      throw new Error("Resposta da IA não é um JSON válido:\n" + jsonResposta);
    }

  } catch (error) {
    console.error("Erro no processamento do formulário médico:", error);
    throw error;
  }
}



export async function tratarOCRParaReceitas(textoOCR) {

  console.log("Texto OCR recebido:", textoOCR);

  try {
    if (!textoOCR || typeof textoOCR !== "string" || textoOCR.trim().length < 10) {
      throw new Error("Texto OCR inválido ou muito curto.");
    }

    const textoTratado = textoOCR
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
      .replace(/[^a-zA-Z0-9À-ÿ.,\s/-]/g, "")
      .trim();

    const prompt = `Você é um assistente que interpreta textos médicos extraídos via OCR e transforma os dados em JSON estruturado para serem incluídos em um sistema de receitas médicas.

Leia o texto abaixo e extraia os campos:
- "data" (formato YYYY-MM-DD ou DD/MM/YYYY),
- "medico" "Formate o nome do médico com a capitalização correta, usando maiúscula só nas primeiras letras de cada palavra, sem deixar tudo em maiúsculo ou tudo minúsculo.",
- "crm" (registro do médico),
- "medicamentos" (uma lista de medicamentos, onde cada medicamento deve ter os seguintes campos):
  - "nome": nome do medicamento,
  - "quantidade": quantidade do medicamento,
  - "formaDeUso": instruções de uso do medicamento,
- "observacoes": observações adicionais,
- "resumo": "Reescreva este texto corrigindo a ortografia, melhorando a formatação e deixando com aparência mais limpa e profissional, como se fosse uma receita médica".

Retorne apenas o JSON com os dados extraídos, no seguinte formato:
{
  "data": "YYYY-MM-DD",
  "medico": "Nome do médico",
  "crm": "CRM do médico",
  "medicamentos": [
    {
      "nome": "Nome do medicamento",
      "quantidade": "Quantidade do medicamento",
      "formaDeUso": "Forma de uso"
    }
  ],
  "observacoes": "Texto das observações",
  "resumo": "Texto do OCR reescrito e normalizado"
}

Não adicione comentários nem explicações.

Texto do OCR:
${textoTratado}`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Você é um assistente que interpreta e organiza dados extraídos via OCR para inclusão em um sistema de receitas médicas.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.0,
      }),
      timeout: 15000,
    });

    if (!res.ok) throw new Error(`Erro na API: ${res.statusText}`);
    const data = await res.json();

    console.log(data)

    let jsonReceita;
    try {
      jsonReceita = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      throw new Error("Resposta da API não é um JSON válido.");
    }

    if (!jsonReceita || typeof jsonReceita !== "object") {
      throw new Error("A resposta da API está incompleta.");
    }

    let dataFormatada = "";
    if (jsonReceita.data) {
      const d = jsonReceita.data.trim();
      if (d.includes("/")) {
        const partes = d.split("/");
        if (partes.length === 3) {
          dataFormatada = `${partes[2]}-${partes[1].padStart(2,"0")}-${partes[0].padStart(2,"0")}`;
        }
      } else {
        dataFormatada = d;
      }
    }

    return {
      dataReceita: dataFormatada || "",
      medico: jsonReceita.medico || "",
      crm: jsonReceita.crm || "",
      medicamentos: Array.isArray(jsonReceita.medicamentos) 
        ? jsonReceita.medicamentos.map(medicamento => ({
            nome: medicamento.nome || "",
            quantidade: medicamento.quantidade || "",
            formaDeUso: medicamento.formaDeUso || ""
          })) 
        : [],
      observacoes: normalizarTexto(jsonReceita.observacoes),
      resumo: normalizarTexto(jsonReceita.resumo)
    };


  } catch (error) {
    console.error("❌ Erro ao tratar OCR:", error.message);
    return { error: error.message };
  }
}

export async function tratarOCRParaExames(textoOCR) {
  try {
    if (!textoOCR || typeof textoOCR !== "string" || textoOCR.trim().length < 10) {
      throw new Error("Texto OCR inválido ou muito curto.");
    }

    const textoTratado = textoOCR
      .replace(/[^a-zA-Z0-9.,\s]/g, "")
      .trim();

    const prompt = `Você é um assistente que interpreta textos extraídos via OCR e transforma os dados em JSON estruturado para exames médicos.

Leia o texto abaixo e extraia os campos:
- "data" (formato YYYY-MM-DD ou DD/MM/YYYY),
- "tipo": tipo do exame,
- "laboratorio": nome do laboratório que realizou o exame,
- "resultado": resultado do exame,
- "observacoes": observações adicionais,
- "resumo": o mesmo texto abaixo, mas reescrito com ortografia corrigida.

Retorne apenas o JSON com os dados extraídos, no seguinte formato:
{
  "data": "YYYY-MM-DD",
  "tipo": "Tipo do exame",
  "laboratorio": "Nome do laboratório",
  "resultado": "Resultado do exame",
  "observacoes": "Texto das observações",
  "resumo": "Texto do OCR reescrito e normalizado. Corrija a ortografia, padronize os termos médicos e organize como se fosse o resultado de um exame laboratorial".
}

Texto do OCR:
${textoTratado}`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Você é um assistente que interpreta e organiza dados extraídos via OCR para inclusão em um sistema de exames médicos.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.0,
      }),
      timeout: 15000,
    });

    console.log("Resposta da API:", res);

    if (!res.ok) throw new Error(`Erro na API: ${res.statusText}`);
    const data = await res.json();

    let jsonExame;
    try {
      jsonExame = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      throw new Error("Resposta da API não é um JSON válido.");
    }

    if (!jsonExame || typeof jsonExame !== "object") {
      throw new Error("A resposta da API está incompleta.");
    }

    return {
      data: jsonExame.data || "",
      tipo: jsonExame.tipo || "",
      laboratorio: jsonExame.laboratorio || "",
      resultado: jsonExame.resultado || "",
      observacoes: normalizarTexto(jsonExame.observacoes),
      resumo: normalizarTexto(jsonExame.resumo),
    };
  } catch (error) {
    console.error("❌ Erro ao tratar OCR para Exames:", error.message);
    return { error: error.message };
  }
}

export async function tratarOCRParaDocumentoClinico(textoOCR) {
  try {
    console.log("Texto OCR recebido:", textoOCR);
    if (!textoOCR || typeof textoOCR !== "string" || textoOCR.trim().length < 10) {
      throw new Error("Texto OCR inválido ou muito curto.");
    }

    const textoTratado = textoOCR
      .replace(/[^a-zA-Z0-9.,\s]/g, "")
      .trim();

    const prompt = `Você é um assistente que interpreta textos extraídos via OCR e transforma os dados em JSON estruturado para documentos clínicos.

Leia o texto abaixo e extraia os campos:
- "data" (formato YYYY-MM-DD ou DD/MM/YYYY),
- "medico": nome do médico,
- "especialidade": especialidade médica do profissional,
- "observacoes": observações adicionais,
- "conclusoes": conclusões do médico sobre o caso,
- "resumo": o mesmo texto abaixo, mas reescrito com ortografia corrigida, pontuação adequada e espaçamento correto. NÃO resuma nem interprete, apenas normalize.

Retorne apenas o JSON com os dados extraídos, no seguinte formato:
{
  "data": "YYYY-MM-DD",
  "medico": "Nome do médico",
  "especialidade": "Especialidade médica",
  "observacoes": "Texto das observações",
  "conclusoes": "Texto das conclusões",
  "resumo": "Texto do OCR reescrito e normalizado"
}

Texto do OCR:
${textoTratado}`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Você é um assistente que interpreta e organiza dados extraídos via OCR para inclusão em um sistema de documentos clínicos.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.0,
      }),
      timeout: 15000,
    });

    console.log("Resposta da API:", res);

    if (!res.ok) throw new Error(`Erro na API: ${res.statusText}`);
    const data = await res.json();

    let jsonDocumento;
    try {
      jsonDocumento = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      throw new Error("Resposta da API não é um JSON válido.");
    }

    if (!jsonDocumento || typeof jsonDocumento !== "object") {
      throw new Error("A resposta da API está incompleta.");
    }

    return {
      data: jsonDocumento.data || "",
      medico: jsonDocumento.medico || "",
      especialidade: jsonDocumento.especialidade || "",
      observacoes: normalizarTexto(jsonDocumento.observacoes),
      conclusoes: normalizarTexto(jsonDocumento.conclusoes),
      resumo: normalizarTexto(jsonDocumento.resumo),
    };
  } catch (error) {
    console.error("❌ Erro ao tratar OCR para Documento Clínico:", error.message);
    return { error: error.message };
  }
}
