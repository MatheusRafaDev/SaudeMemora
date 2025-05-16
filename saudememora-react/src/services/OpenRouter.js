const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.error("⚠️ REACT_APP_OPENROUTER_API_KEY não definida em .env");
}

export async function ajustarTextoFormulario(text) {
  try {
    // Verifica se o texto é válido
    if (!text || typeof text !== "string" || text.trim().length < 10) {
      throw new Error("Texto do formulário inválido ou muito curto");
    }

    // Substitui ocorrências de "NORMAL A ALTA" ou "NORMAL A BAIXA" por "NORMAL"
    let textoCorrigido = text.replace(/NORMAL\s*A\s*(ALTA|BAIXA)/g, "NORMAL");

    // Substitui qualquer ocorrência de "SIM ( )" ou "SIM()" por "NÃO"
    textoCorrigido = textoCorrigido
      .replace(/SIM\s*\(\s*\)/g, "SIM ()")
      .replace(/SIM\s*\(\s*\)/g, "NÃO");

    // O prompt de correção a ser enviado para o GPT
    const prompt = `Leia o questionário abaixo e, ao final, retorne apenas as respostas exatamente como estão, sem correção de ortografia ou formatação. Não modifique nada nos parênteses ou erros de digitação. Apenas forneça as perguntas seguidas das respostas no formato de JSON, com as respostas como "SIM" ou "NÃO" e para na pressao escolher enre normal,alto e baixo se encaixa mais no texto. Não adicione explicações ou observações.

    Texto do formulário:
    ${textoCorrigido}
    `;

    // Requisição para a API com o controle de temperatura ajustado para consistência
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
              "Você é um assistente que ajusta respostas de formulários médicos com base em regras definidas para marcações incorretas ou omissas.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.0, // Ajusta para gerar respostas mais consistentes
      }),
      timeout: 15000,
    });

    // Verifica se a resposta foi bem-sucedida
    if (!res.ok) throw new Error(`Erro na API: ${res.statusText}`);

    // Processa a resposta
    const data = await res.json();
    return data.choices[0].message.content; // Retorna o conteúdo corrigido (em JSON)
  } catch (error) {
    console.error("Erro ao processar o formulário:", error);
    return { error: error.message }; // Retorna o erro caso haja falhas
  }
}

export async function ajustarDadosMedicos(text) {
  try {
    if (!text || typeof text !== "string" || text.trim().length < 10) {
      throw new Error("Texto do formulário inválido ou muito curto");
    }

    const prompt = `Extraia do texto abaixo apenas as perguntas médicas com as respostas sem corrigir ortografia e nem corrigir as respostas. Deixe os parênteses da forma que estavam e os erros também. Apenas corte as perguntas e respostas.

Texto do formulário:
${text}
`;

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
              "Você é um assistente que extrai apenas os dados médicos de formulários, sem realizar correções.",
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

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Erro ao processar dados médicos:", error);
    return `Erro: ${error.message}`;
  }
}


export async function ajustarJSON(text) {
  try {
    if (!text || typeof text !== "string" || text.trim().length < 10) {
      throw new Error("Texto do formulário inválido ou muito curto");
    }

    const prompt = `
Você receberá um texto contendo respostas de um formulário médico.

Sua tarefa é extrair os dados e devolver em JSON **resumido**, sem acentos, tudo em letras minúsculas, com as chaves no estilo snake_case.

Siga exatamente este modelo:

{
  "tratamento_medico": "",
  "gravida": "",
  "regime": "",
  "diabetes": "",
  "alergias": "",
  "reumatica": "",
  "coagulacao": "",
  "cardiaco": "",
  "hemorragico": "",
  "anestesia": "",
  "alergia_medicamentos": "",
  "hepatite": "",
  "hiv": "",
  "drogas": "",
  "fumante": "",
  "fumou": "",
  "pressao": "",
  "respiratorio": ""
}

Preencha apenas com os dados que existirem no texto.  
Se algum campo não estiver presente no texto, **omita do JSON**.  
**Não corrija erros de digitação**, apenas interprete conforme o texto.  
Texto do formulário:
"""${text}"""
`;

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
            content: "Você é um assistente que extrai apenas os dados médicos de formulários, sem realizar correções.",
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

    // Remover delimitadores de bloco de código (```json e ```)
    let content = data.choices[0].message.content;
    content = content.replace(/```json/g, "").replace(/```/g, "").trim();

    // Convertendo a string JSON limpa para um objeto
    const jsonObject = JSON.parse(content);
    return jsonObject;
  } catch (error) {
    console.error("Erro ao processar dados médicos:", error);
    return { error: error.message };
  }
}


function normalizarTexto(texto) {
  if (!texto || typeof texto !== "string") return "";
  return texto
    .replace(/\s+/g, " ")                // substitui múltiplos espaços por um único espaço
    .replace(/(\.|\!|\?)\s*/g, "$1\n")  // coloca quebra de linha após . ! ?
    .trim();
}

export async function tratarOCRParaReceitas(textoOCR) {
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
