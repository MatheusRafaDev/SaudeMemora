package com.pi.saudememora.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pi.saudememora.model.Receita;
import com.pi.saudememora.repository.ReceitaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/receitas")
public class ReceitaController {

    private static final Logger logger = LoggerFactory.getLogger(ReceitaController.class);

    private final ReceitaRepository receitaRepository;
    private final ObjectMapper objectMapper;

    public ReceitaController(ReceitaRepository receitaRepository, ObjectMapper objectMapper) {
        this.receitaRepository = receitaRepository;
        this.objectMapper = objectMapper;
    }

    // 1) RECEBE multipart/form-data (com imagem + JSON em string)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createReceitaComImagem(
            @RequestParam("receitaData") String receitaData,
            @RequestParam("imagem") MultipartFile imagem) {
        try {
            // Desserializa o JSON recebido em um objeto Receita
            Receita receita = objectMapper.readValue(receitaData, Receita.class);
            logger.info("JSON Recebido: {}", receitaData);

            // Validação da imagem
            if (imagem == null || imagem.isEmpty()) {
                return ResponseEntity.badRequest().body("O arquivo de imagem é obrigatório.");
            }

            // Validação do tipo de arquivo (opcional)
            String contentType = imagem.getContentType();
            if (contentType == null ||
                    !(contentType.equals(MediaType.IMAGE_JPEG_VALUE) || contentType.equals(MediaType.IMAGE_PNG_VALUE))) {
                return ResponseEntity.badRequest().body("O arquivo de imagem deve ser do tipo JPEG ou PNG.");
            }

            // Salvar imagem no disco ou em um serviço de armazenamento
            String nomeArquivo = System.currentTimeMillis() + "_" + imagem.getOriginalFilename();
            Path caminhoArquivo = Paths.get("uploads/receitas", nomeArquivo);
            Files.createDirectories(caminhoArquivo.getParent()); // Cria diretórios, se não existirem
            Files.write(caminhoArquivo, imagem.getBytes());

            // Define o caminho da imagem na receita
            receita.setImagem(caminhoArquivo.toString());

            // Associa os medicamentos à receita
            if (receita.getMedicamentos() != null) {
                receita.getMedicamentos().forEach(medicamento -> medicamento.setReceita(receita));
            }

            // Salva a receita (e os medicamentos automaticamente pelo cascade)
            Receita novaReceita = receitaRepository.save(receita);

            // Retorna a resposta de sucesso
            return ResponseEntity.status(HttpStatus.CREATED).body(novaReceita);

        } catch (IOException e) {
            logger.error("Erro ao salvar a imagem:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao salvar a imagem: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Erro ao criar receita (multipart):", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao criar receita: " + e.getMessage());
        }
    }



    @GetMapping
    public ResponseEntity<List<Receita>> getAllReceitas() {
        List<Receita> receitas = receitaRepository.findAll();
        if (receitas.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(receitas);
    }





    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReceita(@PathVariable Long id) {
        return receitaRepository.findById(id)
                .map(r -> {
                    receitaRepository.delete(r);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Receita não encontrada com o ID: " + id));
    }
}
