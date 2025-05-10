
const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.error("⚠️ REACT_APP_OPENROUTER_API_KEY não definida em .env");
}

export async function ajustarTextoFormulario(text) {
  try {
    // Verificação inicial do texto de entrada
    if (!text || typeof text !== 'string' || text.trim().length < 10) {
      throw new Error("Texto do formulário inválido ou muito curto");
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Extraia APENAS a seção 'histórico médico' do formulário, incluindo todas as perguntas e respostas marcadas (SIM/NÃO)."
          },
          {
            role: "user",
            content: text
          }
        ],
       
      }),
      timeout: 10000
    });

    if (!res.ok) throw new Error(`Erro na API: ${res.statusText}`);
    const data = await res.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error("Erro ao processar o formulário:", error);
    return { error: error.message };
  }
}