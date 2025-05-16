package com.pi.saudememora.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pi.saudememora.model.Medicamento;
import com.pi.saudememora.model.Receita;
import com.pi.saudememora.repository.ReceitaRepository;
import com.pi.saudememora.service.ReceitaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/receitas")
@CrossOrigin(origins = "*")
public class ReceitaController {

    private static final Logger logger = LoggerFactory.getLogger(ReceitaController.class);

    private final ReceitaService receitaService;
    private final ObjectMapper objectMapper;
    @Autowired
    private ReceitaRepository receitaRepository;

    public ReceitaController(ReceitaService receitaService, ObjectMapper objectMapper) {
        this.receitaService = receitaService;
        this.objectMapper = objectMapper;
    }


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createReceitaComImagem(
            @RequestParam("receitaData") String receitaData,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem) {
        try {
            // Desserializa JSON para objeto Receita (com lista de medicamentos dentro)
            Receita receita = objectMapper.readValue(receitaData, Receita.class);

            // Associa receita nos medicamentos para manter o relacionamento
            if (receita.getMedicamentos() != null) {
                for (Medicamento med : receita.getMedicamentos()) {
                    med.setReceita(receita);
                }
            }

            // Se imagem existir e não estiver vazia, salva no disco
            if (imagem != null && !imagem.isEmpty()) {
                String contentType = imagem.getContentType();
                if (contentType == null ||
                        !(contentType.equals(MediaType.IMAGE_JPEG_VALUE) || contentType.equals(MediaType.IMAGE_PNG_VALUE))) {
                    return ResponseEntity.badRequest().body("O arquivo de imagem deve ser JPEG ou PNG.");
                }

                String nomeArquivo = System.currentTimeMillis() + "_" + imagem.getOriginalFilename();
                Path caminhoArquivo = Paths.get("uploads/receitas", nomeArquivo);
                Files.createDirectories(caminhoArquivo.getParent());
                Files.write(caminhoArquivo, imagem.getBytes());

                // Guarda o caminho relativo (ou absoluto) na receita
                receita.setImagem(caminhoArquivo.toString());
            }

            // Salva receita (com cascade salva medicamentos)
            Receita novaReceita = receitaService.createReceita(receita);

            return ResponseEntity.status(HttpStatus.CREATED).body(novaReceita);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao salvar a imagem: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao criar receita: " + e.getMessage());
        }
    }


    @GetMapping("/imagem/{id}")
    public ResponseEntity<byte[]> getImagemPorId(@PathVariable Long id) {
        try {
            Optional<Receita> receitaOpt = receitaRepository.findById(id);

            if (receitaOpt.isEmpty() || receitaOpt.get().getImagem() == null) {
                return ResponseEntity.notFound().build();
            }

            Receita receita = receitaOpt.get();
            Path caminho = Paths.get(receita.getImagem());

            if (!Files.exists(caminho)) {
                return ResponseEntity.notFound().build();
            }

            byte[] imagemBytes = Files.readAllBytes(caminho);
            String contentType = Files.probeContentType(caminho);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(imagemBytes);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/documento/{id}")
    public List<Receita> listarPorDocumento(@PathVariable Long id) {
        return receitaRepository.findByDocumentoId(id);
    }

}