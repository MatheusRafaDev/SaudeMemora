package com.pi.saudememora.controller;

import com.pi.saudememora.model.Documentos;
import com.pi.saudememora.repository.DocumentosRepository;
import com.pi.saudememora.service.DocumentosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/documentos")
@CrossOrigin(origins = "*")
public class DocumentosController {

    @Autowired
    private DocumentosRepository documentosRepository;


    @Autowired
    private DocumentosService documentosService;
    @GetMapping("/listarFiltro")
    public ResponseEntity<Documentos> buscarDocumentos(@RequestParam String tipo,
                                                       @RequestParam String status,
                                                       @RequestParam String dataUpload) {
        Optional<Documentos> documentos = documentosRepository.findByStatusAndTipoDocumentoAndDataUpload(tipo, status, dataUpload);
        return documentos.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
