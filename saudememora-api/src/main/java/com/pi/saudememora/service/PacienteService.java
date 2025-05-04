package com.pi.saudememora.service;

import com.pi.saudememora.model.Paciente;
import com.pi.saudememora.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    public Paciente buscarPorId(Long pacienteId) {
        return pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado com id: " + pacienteId));
    }
}