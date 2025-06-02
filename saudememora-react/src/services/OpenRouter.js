const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.error("⚠️ REACT_APP_OPENROUTER_API_KEY não definida em .env");
}

function normalizarTexto(texto) {
  if (!texto || typeof texto !== "string") return "";
  return texto
    .replace(/\s+/g, " ") // substitui múltiplos espaços por um único espaço
    .replace(/(\.|\!|\?)\s*/g, "$1\n") // coloca quebra de linha após . ! ?
    .trim();
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

    // Remover delimitadores de bloco de código (```json e ```)
    let content = data.choices[0].message.content;
    content = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Convertendo a string JSON limpa para um objeto
    const jsonObject = JSON.parse(content);
    return jsonObject;
  } catch (error) {
    console.error("Erro ao processar dados médicos:", error);
    return { error: error.message };
  }
}

export async function tratarOCRParaReceitas(textoOCR) {
  try {
    if (
      !textoOCR ||
      typeof textoOCR !== "string" ||
      textoOCR.trim().length < 10
    ) {
      throw new Error("Texto OCR inválido ou muito curto.");
    }

    const textoTratado = textoOCR
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9À-ÿ.,\s/-]/g, "")
      .trim();

    const prompt = `Você é um assistente que interpreta textos médicos extraídos via OCR e transforma os dados em JSON estruturado para serem incluídos em um sistema de receitas médicas.

    Leia o texto abaixo e extraia os campos:
    - "dataReceita" (formato YYYY-MM-DD ou DD/MM/YYYY),
    - "medico" "Formate o nome do médico com a capitalização correta, usando maiúscula só nas primeiras letras de cada palavra, sem deixar tudo em maiúsculo ou tudo minúsculo.",
    - "crm" (registro do médico),
    - "medicamentos" (uma lista de medicamentos, onde cada medicamento deve ter os seguintes campos):
      - "nome": nome do medicamento,
      - "quantidade": quantidade do medicamento,
      - "formaDeUso": instruções de uso do medicamento,
    - "observacoes": observações adicionais,
    - "resumo": "Reescreva este texto corrigindo a ortografia, melhorando a formatação e a idetação textual.

    IMPORTANTE: Se algum dos campos acima não estiver presente no texto ou estiver vazio, preencha com um texto padrão explicativo para evitar valores vazios ou nulos.

    Retorne apenas o JSON com os dados extraídos, no seguinte formato:
    {
      "dataReceita": "YYYY-MM-DD",
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
      "resumo": "Texto do OCR reescrito e normalizado. Corrija a ortografia, padronize os termos médicos e organize como se fosse uma receita".
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
    if (jsonReceita.dataReceita) {
      const d = jsonReceita.dataReceita.trim();
      if (d.includes("/")) {
        const partes = d.split("/");
        if (partes.length === 3) {
          dataFormatada = `${partes[2]}-${partes[1].padStart(
            2,
            "0"
          )}-${partes[0].padStart(2, "0")}`;
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
        ? jsonReceita.medicamentos.map((medicamento) => ({
            nome: medicamento.nome || "",
            quantidade: medicamento.quantidade || "",
            formaDeUso: medicamento.formaDeUso || "",
          }))
        : [],
      observacoes: normalizarTexto(jsonReceita.observacoes),
      resumo: normalizarTexto(jsonReceita.resumo),
    };
  } catch (error) {
    console.error("❌ Erro ao tratar OCR:", error.message);
    return { error: error.message };
  }
}

export async function tratarOCRParaExames(textoOCR) {
  try {
    if (
      !textoOCR ||
      typeof textoOCR !== "string" ||
      textoOCR.trim().length < 10
    ) {
      throw new Error("Texto OCR inválido ou muito curto.");
    }

    const textoTratado = textoOCR.replace(/[^a-zA-Z0-9.,\s]/g, "").trim();

    const prompt = `Você é um assistente que interpreta textos extraídos via OCR e transforma os dados em JSON estruturado para exames médicos.

    Leia o texto abaixo e extraia os campos:
    - "dataExame" (formato YYYY-MM-DD ou DD/MM/YYYY),
    - "tipo": tipo do exame,
    - "laboratorio": nome do laboratório que realizou o exame,
    - "resultado": resultado do exame,
    - "observacoes": observações adicionais,
    - "resumo": o mesmo texto abaixo, mas reescrito com ortografia corrigida e identado bom para leitura.
    - "nomeExame": nome do exame, se houver.
    Se o texto contiver palavras como "LAUDO", "EXAME", "RESULTADO", ou termos similares, utilize o tipo correspondente.

    IMPORTANTE: Se algum dos campos acima não estiver presente no texto ou estiver vazio, preencha com um texto padrão explicativo para evitar valores vazios ou nulos.

    Retorne apenas o JSON com os dados extraídos, no seguinte formato:
    {
      "dataExame": "YYYY-MM-DD",
      "tipo": "Tipo do exame",
      "laboratorio": "Nome do laboratório",
      "resultado": "Resultado do exame",
      "observacoes": "Texto das observações",
      "resumo": "Texto do OCR reescrito e normalizado. Corrija a ortografia, padronize os termos médicos e organize como se fosse o resultado de um exame laboratorial".
      "nomeExame": "Nome do exame, se houver"
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
        temperature: 0.2,
      }),
      timeout: 15000,
    });

    if (!res.ok) throw new Error(`Erro na API: ${res.statusText}`);
    const data = await res.json();

    console.log("Resposta da API:", data);
    let jsonExame;
    try {
      jsonExame = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      jsonExame = JSON.parse(data.choices[0].message.content);
      throw new Error("Resposta da API não é um JSON válido.");
    }

    if (!jsonExame || typeof jsonExame !== "object") {
      throw new Error("A resposta da API está incompleta.");
    }

    let dataFormatada = "";
    if (jsonExame.dataExame) {
      const d = jsonExame.dataExame.trim();
      if (d.includes("/")) {
        const partes = d.split("/");
        if (partes.length === 3) {
          dataFormatada = `${partes[2]}-${partes[1].padStart(
            2,
            "0"
          )}-${partes[0].padStart(2, "0")}`;
        }
      } else {
        dataFormatada = d;
      }
    }

    return {
      dataExame: dataFormatada || "",
      tipo: jsonExame.tipo || "",
      laboratorio: jsonExame.laboratorio || "",
      resultado: jsonExame.resultado || "",
      observacoes: jsonExame.observacoes,
      resumo: jsonExame.resumo,
      nomeExame: jsonExame.nomeExame || "",
    };
  } catch (error) {
    console.error("❌ Erro ao tratar OCR para Exames:", error.message);
    return { error: error.message };
  }
}

export async function tratarOCRParaDocumentoClinico(textoOCR) {
  try {
    if (
      !textoOCR ||
      typeof textoOCR !== "string" ||
      textoOCR.trim().length < 10
    ) {
      throw new Error("Texto OCR inválido ou muito curto.");
    }

    const textoTratado = textoOCR

    const prompt = `Você é um assistente que interpreta textos extraídos via OCR e transforma os dados em JSON estruturado para documentos clínicos.

    Leia o texto abaixo e extraia os campos:
    - "dataDocumentoCli" (formato YYYY-MM-DD ou DD/MM/YYYY),
    - "medico": nome do médico,
    - "especialidade": especialidade médica,
    - "observacoes": observações do documento gerais,
    - "conclusoes": conclusões do médico geral,
    - "resumo": o mesmo texto abaixo, mas reescrito com ortografia corrigida, pontuação adequada e espaçamento correto e faça uma identação textual,
    - "tipo": tipo do documento (laudo, atestado, receita, relatório, exame, entre outros), que deve ser identificado sempre com base no conteúdo, mesmo que o texto não tenha título explícito.

    Se o texto contiver palavras como "LAUDO MÉDICO", "ATESTADO", "RECEITA", "RELATÓRIO", ou termos similares, utilize o tipo correspondente.  
    Se não houver título claro, inferir o tipo com base no conteúdo.


    IMPORTANTE: Se algum dos campos acima não estiver presente ou estiver vazio, preencha com um texto padrão explicativo para evitar valores vazios ou nulos.

    Retorne apenas o JSON com os dados extraídos, no seguinte formato:
    {
      "dataDocumentoCli": "YYYY-MM-DD",
      "medico": "Nome do médico",
      "especialidade": "Especialidade médica",
      "observacoes": "observações",
      "conclusoes": "conclusões",
      "resumo": "reformatar textos extraídos via OCR para melhorar a legibilidade.",
      "tipo": "tipo do documento ou titulo dado (laudo, atestado, receita, relatório, exame, etc.) com base no que está escrito"
    }

    Texto do OCR:
    ${textoTratado}
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

    let dataFormatada = "";
    if (jsonDocumento.dataDocumentoCli) {
      const d = jsonDocumento.dataDocumentoCli.trim();
      if (d.includes("/")) {
        const partes = d.split("/");
        if (partes.length === 3) {
          dataFormatada = `${partes[2]}-${partes[1].padStart(
            2,
            "0"
          )}-${partes[0].padStart(2, "0")}`;
        }
      } else {
        dataFormatada = d;
      }
    }



    return {
      dataDocumentoCli: jsonDocumento.dataDocumentoCli || "",
      medico: jsonDocumento.medico || "",
      especialidade: jsonDocumento.especialidade || "",
      tipo: jsonDocumento.tipo || "",
      observacoes: normalizarTexto(jsonDocumento.observacoes),
      conclusoes: normalizarTexto(jsonDocumento.conclusoes),
      resumo: normalizarTexto(jsonDocumento.resumo),
    };
  } catch (error) {
    console.error(
      "❌ Erro ao tratar OCR para Documento Clínico:",
      error.message
    );
    return { error: error.message };
  }
}

export async function extrairMedicamentosDoOCR(textoOCR) {
  try {
    if (
      !textoOCR ||
      typeof textoOCR !== "string" ||
      textoOCR.trim().length < 10
    ) {
      throw new Error("Texto OCR inválido ou muito curto.");
    }

    const textoTratado = textoOCR
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9À-ÿ.,\s/-]/g, "")
      .trim();

    const prompt = `Extraia apenas os medicamentos do texto OCR abaixo, retornando um JSON no formato:

    

       sem ter nomes iguais de medicamentos, e sem repetir medicamentos.

      {
        "medicamentos": [
          {
            "nome": "Nome do medicamento (em formato normal, não em maiúsculas)",
            "quantidade": "Dose por aplicação/uso (ex: '1 comprimido', '2 gotas', '5ml')",
            "formaDeUso": "Via de administração + duração (ex: 'via oral por 5 dias', 'intramuscular por 1 semana')"
          }
        ]
      }

      não quero que tenha marcação markdown, nem explicações, nem formatação. Apenas o JSON.
      Texto OCR:

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
              "Você é um assistente que extrai medicamentos de textos OCR médicos.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1,
      }),
      timeout: 15000,
    });

    if (!res.ok) throw new Error(`Erro na API: ${res.statusText}`);

    const data = await res.json();

    let jsonReceita;
    try {
      jsonReceita = JSON.parse(data.choices?.[0]?.message?.content || "{}");
    } catch (e) {
      throw new Error("Resposta da API não é um JSON válido.");
    }

    // Validação: se o array estiver vazio ou não existir, joga erro
    if (
      !jsonReceita.medicamentos ||
      !Array.isArray(jsonReceita.medicamentos) ||
      jsonReceita.medicamentos.length === 0
    ) {
      throw new Error("Nenhum medicamento encontrado.");
    }

    return jsonReceita.medicamentos;
  } catch (error) {
    console.error("❌ Erro ao extrair medicamentos:", error.message);
    return { error: error.message };
  }
}

export async function formatarTextoOCR2(textoOCR) {
  try {
    // Pré-processamento inteligente para qualquer tipo de texto
    let textoTratado = textoOCR
      .replace(/([a-z])([A-Z0-9])/g, "$1 $2") // Separa palavras coladas (ex: "HospitalDaLuz" → "Hospital Da Luz")
      .replace(/([0-9])([A-Za-z])/g, "$1 $2") // Separa números de letras (ex: "G55" → "G 55")
      .replace(/_/g, " ") // Remove underscores
      .replace(/\s+/g, " ") // Normaliza espaços
      .replace(/(\d)([A-Za-z])/g, "$1 $2") // Separa letras de números (ex: "2ml" → "2 ml")
      .trim();

    const promptUniversal = `
      Corrija e formate este texto extraído por OCR, melhorando a legibilidade e a estruturação conforme padrões de documentação médica.
       Mantenha o conteúdo técnico preciso, mas ajuste erros de ortografia, pontuação e organização.
    ${textoTratado}`;

    const controller = new AbortController();
    setTimeout(() => controller.abort(), 20000); // Timeout de 20s

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo", // Modelo mais preciso para textos variados
          messages: [
            {
              role: "system",
              content:
                "Você é um especialista em correção de textos extraídos por OCR. Sua tarefa é melhorar a legibilidade sem alterar o significado original.",
            },
            {
              role: "user",
              content: promptUniversal,
            },
          ],
          temperature: 0.3, // Equilíbrio entre correção e criatividade
          max_tokens: 2000,
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) throw new Error(`Erro na API: ${response.status}`);

    const data = await response.json();
    let textoFormatado = data.choices?.[0]?.message?.content?.trim();

    // Pós-processamento para garantir consistência
    if (textoFormatado) {
      textoFormatado = textoFormatado
        .replace(/(\d)\s*([mg])\s*\/\s*([ml])/gi, "$1$2/$3") // Padroniza mg/ml
        .replace(/\b(\d+)\s*([a-z]{2})\b/gi, "$1 $2") // Espaço entre número e unidade (ex: "2ml" → "2 ml")
        .replace(/\s{2,}/g, "\n\n"); // Quebras de linha para parágrafos
    }

    return textoFormatado || textoOCR; // Fallback para o original se falhar
  } catch (error) {
    console.error("Erro ao formatar texto OCR:", error.message);
    return textoOCR; // Retorna o original em caso de erro
  }
}

export async function formatarTextoOCR(textoOCR, TextoOCR2) {
  try {
    const textoUnificado = `${textoOCR}\n\n${TextoOCR2}`;

    const prompt = `
Corrija os erros ortográficos e unifique as informações dos dois textos. Mantenha a estrutura, sem tira o telefone e etc. e fazendo dasagem correta dos medicamentos.

Texto a processar:
${textoUnificado}
`;

    const controller = new AbortController();
    setTimeout(() => controller.abort(), 20000);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
            content: "Você é um filtro de texto OCR médico. Corrija erros ortográficos, una informações duplicadas e preserve a estrutura clínica.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0,
        max_tokens: 2000,
      }),
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`Erro na API: ${response.status}`);

    const data = await response.json();
    let textoCorrigido = data.choices?.[0]?.message?.content;
    return textoCorrigido;
  } catch (error) {
    console.error("Erro ao processar texto:", error.message);
    return (textoOCR + "\n\n" + TextoOCR2)
      .replace(/[^a-zA-Z0-9\u00C0-\u017F\s\/\-\.,:()0-9mg%]/g, "")
      .replace(/\n\s*\n/g, "\n");
  }
}

