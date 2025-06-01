package com.pi.saudememora.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pi.saudememora.model.DocumentoClinico;
import com.pi.saudememora.repository.DocumentoClinicoRepository;
import com.pi.saudememora.service.DocumentoClinicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/documentosclinicos")
public class DocumentoClinicoController {

    @Autowired
    private DocumentoClinicoService service;

    @Autowired
    private DocumentoClinicoRepository documentoClinicoRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public List<DocumentoClinico> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/paciente/{pacienteId}")
    public List<DocumentoClinico> listarPorPaciente(@PathVariable Long pacienteId) {
        return service.listarPorPaciente(pacienteId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentoClinico> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> criarDocumentoClinicoComArquivo(
            @RequestParam("documentoData") String documentoData,
            @RequestParam(value = "imagem", required = false) MultipartFile arquivo) {
        try {
            System.out.println(arquivo);
            // Supondo que você use ObjectMapper para converter JSON em objeto
            DocumentoClinico documento = objectMapper.readValue(documentoData, DocumentoClinico.class);

            if (arquivo != null && !arquivo.isEmpty()) {
                String nomeArquivo = System.currentTimeMillis() + "_" + arquivo.getOriginalFilename();
                Path caminho = Paths.get("uploads/documentos", nomeArquivo);
                Files.createDirectories(caminho.getParent());
                Files.write(caminho, arquivo.getBytes());
                documento.setImagem(caminho.toString());  // ajuste para o campo correto
            }

            DocumentoClinico salvo = service.salvar(documento);
            return ResponseEntity.status(HttpStatus.CREATED).body(salvo);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao salvar arquivo: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao salvar documento: " + e.getMessage());
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<DocumentoClinico> atualizar(@PathVariable Long id, @RequestBody DocumentoClinico documento) {
        try {
            Optional<DocumentoClinico> documentoExistente = service.buscarPorId(id);
            if (documentoExistente.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            DocumentoClinico documentoAtual = documentoExistente.get();

            if (documento.getTipo() != null) {
                documentoAtual.setTipo(documento.getTipo());
            }

            if (documento.getData() != null) {
                documentoAtual.setData(documento.getData());
            }
            DocumentoClinico atualizado = service.salvar(documentoAtual);
            return ResponseEntity.ok(atualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/imagem/{id}")
    public ResponseEntity<byte[]> getImagemDocumentoClinicoPorId(@PathVariable Long id) {
        try {
            Optional<DocumentoClinico> documentoOpt = documentoClinicoRepository.findById(id);

            if (documentoOpt.isEmpty() || documentoOpt.get().getImagem() == null) {
                return ResponseEntity.notFound().build();
            }

            DocumentoClinico documento = documentoOpt.get();
            Path caminho = Paths.get(documento.getImagem());

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
    public List<DocumentoClinico> listarPorDocumento(@PathVariable Long id) {
        return documentoClinicoRepository.findByDocumentoId(id);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
