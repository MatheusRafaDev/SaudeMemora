package com.pi.saudememora.service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

public class OpenRouterService {
    private final String apiKey;

    public OpenRouterService(String apiKey) {
        this.apiKey = apiKey;
    }

    public String callOpenRouterAPI(String prompt) throws IOException {
        URL url = new URL("https://openrouter.ai/api/v1/chat/completions"); // endpoint OpenRouter
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", "Bearer " + apiKey);
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        // Corpo da requisição
        String body = String.format("""
            {
              "model": "openchat/openchat-3.5-0106",
              "messages": [
                { "role": "user", "content": %s }
              ],
              "temperature": 0.7
            }
            """, toJsonString(prompt));

        // Enviar request
        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = body.getBytes("utf-8");
            os.write(input, 0, input.length);
        }

        // Ler resposta
        StringBuilder response = new StringBuilder();
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(conn.getInputStream(), "utf-8"))) {
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }
        }

        return response.toString();
    }

    // Garante aspas escapadas corretamente para o JSON
    private String toJsonString(String text) {
        return "\"" + text.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n") + "\"";
    }
}
