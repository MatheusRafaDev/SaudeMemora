package com.pi.saudememora.service;

import com.pi.saudememora.model.DocumentoClinico;
import com.pi.saudememora.repository.DocumentoClinicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DocumentoClinicoService {

    @Autowired
    private DocumentoClinicoRepository repository;

    public List<DocumentoClinico> listarTodos() {
        return repository.findAll();
    }

    public List<DocumentoClinico> listarPorPaciente(Long pacienteId) {
        return repository.findByPacienteId(pacienteId);
    }

    public Optional<DocumentoClinico> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public DocumentoClinico salvar(DocumentoClinico documento) {
        return repository.save(documento);
    }

    public DocumentoClinico atualizar(Long id, DocumentoClinico documento) {
        Optional<DocumentoClinico> existente = repository.findById(id);
        if (existente.isPresent()) {
            DocumentoClinico docAtual = existente.get();
            // Atualiza campos
            docAtual.setMedico(documento.getMedico());
            docAtual.setEspecialidade(documento.getEspecialidade());
            docAtual.setData(documento.getData());
            docAtual.setObservacoes(documento.getObservacoes());
            docAtual.setConclusoes(documento.getConclusoes());
            docAtual.setPaciente(documento.getPaciente());

            return repository.save(docAtual);
        } else {
            return null; // Ou lançar exceção
        }
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
