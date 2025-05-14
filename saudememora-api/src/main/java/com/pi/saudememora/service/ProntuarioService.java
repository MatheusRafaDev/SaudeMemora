package com.pi.saudememora.service;

import com.pi.saudememora.model.Prontuario;
import com.pi.saudememora.repository.ProntuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProntuarioService {

    @Autowired
    private ProntuarioRepository prontuarioRepository;

    // Salvar ou atualizar o prontuário
    public Prontuario save(Prontuario prontuario) {
        return prontuarioRepository.save(prontuario);
    }

    // Buscar prontuário por ID
    public Prontuario findById(Long id) {
        Optional<Prontuario> prontuario = prontuarioRepository.findById(id);
        return prontuario.orElse(null);  // Retorna o prontuário ou null se não encontrar
    }

    // Deletar o prontuário por ID
    public void delete(Long id) {
        prontuarioRepository.deleteById(id);
    }
}
