package com.microservicetransport.chat_backend.ml_service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.text.Normalizer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PythonModelService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String askVisaBot(String question) {
        String rawResponse = callPythonOrMistral(question);
        return cleanBotResponse(rawResponse);
    }

    private String cleanBotResponse(String rawResponse) {
        try {
            JsonNode node = objectMapper.readTree(rawResponse);
            if (node.has("answer")) {
                String answer = node.get("answer").asText();

                // Nettoyage général
                String cleaned = answer
                        .replaceAll("\\*\\*", "")
                        .replaceAll("__", "")
                        .replaceAll("\\\\n", "\n")
                        .replaceAll("\\\\r", "");

                cleaned = decodeUnicode(cleaned);
                cleaned = Normalizer.normalize(cleaned, Normalizer.Form.NFC);

                return cleaned.trim();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return rawResponse;
    }

    private String decodeUnicode(String text) {
        Pattern unicodePattern = Pattern.compile("\\\\u([0-9a-fA-F]{4})");
        Matcher matcher = unicodePattern.matcher(text);
        StringBuffer sb = new StringBuffer();
        while (matcher.find()) {
            int code = Integer.parseInt(matcher.group(1), 16);
            matcher.appendReplacement(sb, Character.toString((char) code));
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    // 🔥 Appel dynamique au modèle Python (ou Mistral)
    private String callPythonOrMistral(String question) {
        try {
            String url = "http://127.0.0.1:5000/ask"; // ton service Python
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString("{\"question\":\"" + question + "\"}"))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return response.body();
        } catch (Exception e) {
            e.printStackTrace();
            return "{ \"answer\": \"Désolé, je n’ai pas pu traiter votre question pour le moment.\" }";
        }
    }
}
