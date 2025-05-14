package com.pi.saudememora.service;

import com.pi.saudememora.model.Documentos;
import com.pi.saudememora.repository.DocumentosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DocumentosService {

    @Autowired
    private DocumentosRepository documentoRepository;

    // Criar ou atualizar documento
    public Documentos save(Documentos documento) {
        return documentoRepository.save(documento);
    }

    // Buscar todos os documentos
    public List<Documentos> findAll() {
        return documentoRepository.findAll();
    }

    // Buscar documento por ID
    public Optional<Documentos> findById(Long id) {
        return documentoRepository.findById(id);
    }

    // Deletar documento por ID
    public void deleteById(Long id) {
        documentoRepository.deleteById(id);
    }

    // Buscar documentos por algum critério específico (exemplo: status)
    public List<Documentos> findByStatus(String status) {
        return documentoRepository.findByStatus(status);
    }
}
