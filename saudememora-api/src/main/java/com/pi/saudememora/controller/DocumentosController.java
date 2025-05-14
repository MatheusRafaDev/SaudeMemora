package com.pi.saudememora.controller;

import com.pi.saudememora.model.Documentos;
import com.pi.saudememora.repository.DocumentosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documentos")
@CrossOrigin(origins = "*") // Libera para testes locais
public class DocumentosController {

    @Autowired
    private DocumentosRepository documentosRepository;

    // GET por ID
    @GetMapping("/{id}")
    public ResponseEntity<Documentos> getDocumentoById(@PathVariable Long id) {
        return documentosRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET por ID do paciente
    @GetMapping("/paciente/{id}")
    public ResponseEntity<List<Documentos>> getDocumentosPorPaciente(@PathVariable Long id) {
        List<Documentos> documentos = documentosRepository.findByPacienteId(id);
        return ResponseEntity.ok(documentos);
    }

    // GET por Tipo de Documento (Ex: R, E, P)
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Documentos>> getDocumentosPorTipo(@PathVariable String tipo) {
        List<Documentos> documentos = documentosRepository.findByTipoDocumento(tipo.toUpperCase());
        return ResponseEntity.ok(documentos);
    }
}
