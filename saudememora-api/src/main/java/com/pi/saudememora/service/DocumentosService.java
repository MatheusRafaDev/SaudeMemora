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
    private DocumentosRepository documentosRepository;

    // Criar ou atualizar documento
    public Documentos save(Documentos documento) {
        return documentosRepository.save(documento);
    }

    // Buscar todos os documentos
    public List<Documentos> findAll() {
        return documentosRepository.findAll();
    }

    // Buscar documento por ID (Optional)
    public Optional<Documentos> findById(Long id) {
        return documentosRepository.findById(id);
    }

    // Buscar documento por ID (com exceção se não encontrado)
    public Documentos buscarPorId(Long id) {
        return documentosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento não encontrado com id: " + id));
    }

    // Deletar documento por ID
    public void deleteById(Long id) {
        documentosRepository.deleteById(id);
    }

    // Buscar documentos por status
    public List<Documentos> findByStatus(String status) {
        return documentosRepository.findByStatus(status);
    }
}
