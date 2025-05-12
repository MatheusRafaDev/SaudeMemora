package com.pi.saudememora.controller;

import com.pi.saudememora.model.Documentos;
import com.pi.saudememora.repository.DocumentosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/documentos")
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

    // GET por Tipo de Documento (Ex: R, E, P)
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Documentos>> getDocumentosPorTipo(@PathVariable String tipo) {
        List<Documentos> documentos = documentosRepository.findByTipoDocimento(tipo.toUpperCase());
        return ResponseEntity.ok(documentos);
    }

    // GET por Paciente, agrupando por tipo (R, E, P)
    @GetMapping("/paciente/{id}")
    public ResponseEntity<Map<String, List<Documentos>>> getDocumentosPorPacienteAgrupado(@PathVariable Long id) {
        List<Documentos> documentos = documentosRepository.findByPacienteId(id);

        Map<String, List<Documentos>> agrupados = documentos.stream()
                .collect(Collectors.groupingBy(Documentos::getTipoDocimento));

        return ResponseEntity.ok(agrupados);
    }
}
