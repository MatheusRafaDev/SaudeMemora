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