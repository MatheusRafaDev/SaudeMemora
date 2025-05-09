package com.pi.saudememora.service;

import com.pi.saudememora.model.Documentos;
import com.pi.saudememora.repository.DocumentosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DocumentosService {
    @Autowired
    private DocumentosRepository documentosRepository;

    public Documentos buscarPorId(Long documentosId) {
        return documentosRepository.findById(documentosId)
                .orElseThrow(() -> new RuntimeException("Documentos não encontrado com id: " + documentosId));
    }
}
