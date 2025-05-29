package com.pi.saudememora.service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.pi.saudememora.model.Receita;

public class OCRProcessor {
    private final OpenRouterService openRouterService;
    private final Gson gson = new Gson();

    public OCRProcessor(String apiKey) {
        this.openRouterService = new OpenRouterService(apiKey);
    }

    public Receita tratarOCRParaReceitas(String textoOCR) throws Exception {
        if (textoOCR == null || textoOCR.trim().length() < 10) {
            throw new IllegalArgumentException("Texto OCR inválido ou muito curto.");
        }

        // Limpeza básica do texto OCR
        String textoTratado = textoOCR
                .replaceAll("[^a-zA-Z0-9À-ÿ.,\\s/-]", "")
                .trim();

        // Prompt claro e específico para o modelo
        String prompt = String.format("""
            A partir do texto abaixo, extraído por OCR de uma receita médica, gere um JSON com as seguintes informações, mesmo que o texto esteja bagunçado:

            Formato esperado:
            {
              "nomePaciente": "Nome completo do paciente",
              "medico": "Nome completo do médico",
              "crm": "CRM do médico com estado (ex: CRM/SP 123456)",
              "data": "Data da receita no formato dd/MM/yyyy",
              "medicamentos": [
                {
                  "nome": "Nome do medicamento",
                  "posologia": "Posologia e modo de uso conforme indicado"
                }
              ]
            }

            ⚠ IMPORTANTE:
            - Apenas retorne o JSON, sem explicações.
            - Se algum campo não estiver claro, preencha com null.
            - O campo "medicamentos" deve ser uma lista, mesmo que tenha apenas um item.

            Texto extraído por OCR:
            %s
            """, textoTratado);

        // Chamada à API do OpenRouter
        String jsonResponse = openRouterService.callOpenRouterAPI(prompt);

        // Extrair o conteúdo JSON retornado da resposta
        JsonObject responseObj = JsonParser.parseString(jsonResponse).getAsJsonObject();
        String jsonContent = responseObj.getAsJsonArray("choices")
                .get(0).getAsJsonObject()
                .getAsJsonObject("message")
                .get("content").getAsString();

        // Desserializar para objeto Receita
        Receita receita = gson.fromJson(jsonContent, Receita.class);
        return receita;
    }
}
