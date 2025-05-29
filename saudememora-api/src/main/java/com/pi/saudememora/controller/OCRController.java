package com.pi.saudememora.controller;

import com.pi.saudememora.service.IAService;
import com.pi.saudememora.service.OcrService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/ocr")
public class OCRController {

    private final OcrService ocrService;
    private final IAService iaService;

    public OCRController(OcrService ocrService, IAService iaService) {
        this.ocrService = ocrService;
        this.iaService = iaService;
    }

    @PostMapping(value = "/receita", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> processarReceitaOCR(@RequestParam("file") MultipartFile arquivo) {
        try {
            if (arquivo.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Arquivo não pode ser vazio"));
            }

            // Use OCR local:
            String textoOCR = ocrService.processarOCRLocal(arquivo);

            // Se preferir usar OCR Space API, chame:
            // String textoOCR = ocrService.processarOCRViaOCRSpaceAPI(arquivo);

            Map<String, Object> dadosReceita = iaService.tratarTextoReceita(textoOCR);

            return ResponseEntity.ok(dadosReceita);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping(value = "/exame", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> processarExameOCR(@RequestParam("file") MultipartFile arquivo) {
        try {
            if (arquivo.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Arquivo não pode ser vazio"));
            }

            String textoOCR = ocrService.processarOCRLocal(arquivo);
            Map<String, Object> dadosExame = iaService.tratarTextoExame(textoOCR);

            return ResponseEntity.ok(dadosExame);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping(value = "/documento-clinico", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> processarDocumentoClinicoOCR(@RequestParam("file") MultipartFile arquivo) {
        try {
            if (arquivo.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Arquivo não pode ser vazio"));
            }

            String textoOCR = ocrService.processarOCRLocal(arquivo);
            Map<String, Object> dadosDocumento = iaService.tratarTextoDocumentoClinico(textoOCR);

            return ResponseEntity.ok(dadosDocumento);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
