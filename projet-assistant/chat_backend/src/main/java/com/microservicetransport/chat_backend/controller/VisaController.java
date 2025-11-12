package com.microservicetransport.chat_backend.controller;

import com.microservicetransport.chat_backend.dto.BotResponseDTO;
import com.microservicetransport.chat_backend.dto.QuestionDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.file.Paths;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/visa")
@CrossOrigin("*")
public class VisaController {


    // Chemin absolu vers le script Python
    private static final String PYTHON_SCRIPT = "C:\\Users\\LENOVO\\Desktop\\ChatBot_Bambara_Fr_Ang\\projet-assistant\\python\\visa_model.py";


    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/ask")
    public BotResponseDTO askVisa(@RequestBody QuestionDTO dto) {
        try {
            // Vérifier que le script existe
            File scriptFile = new File(PYTHON_SCRIPT);
            if (!scriptFile.exists()) {
                return new BotResponseDTO("Erreur : le script Python n'existe pas à l'emplacement " + scriptFile.getAbsolutePath());
            }

            // Créer le process Python
            ProcessBuilder pb = new ProcessBuilder("python", PYTHON_SCRIPT);
            Process process = pb.start();

            // Envoyer la question au script via stdin
            try (OutputStream os = process.getOutputStream()) {
                String inputJson = objectMapper.writeValueAsString(dto);
                os.write(inputJson.getBytes());
                os.flush();
            }

            // Lire stdout
            String responseJson;
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                responseJson = reader.lines().collect(Collectors.joining("\n"));
            }

            // Lire stderr pour diagnostic
            try (BufferedReader errReader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                String errors = errReader.lines().collect(Collectors.joining("\n"));
                if (!errors.isBlank()) {
                    System.err.println("Erreurs Python :\n" + errors);
                }
            }

            // Attendre la fin du script
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                return new BotResponseDTO("Erreur : le script Python a échoué avec le code " + exitCode);
            }

            // Extraire le champ "answer" du JSON
            JsonNode rootNode = objectMapper.readTree(responseJson);
            JsonNode answerNode = rootNode.get("answer");
            String answer = (answerNode != null) ? answerNode.asText() : "Aucune réponse reçue du bot.";

            return new BotResponseDTO(answer);

        } catch (Exception e) {
            e.printStackTrace();
            return new BotResponseDTO("Erreur : impossible d'obtenir la réponse du bot.");
        }
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello World";
    }
}
