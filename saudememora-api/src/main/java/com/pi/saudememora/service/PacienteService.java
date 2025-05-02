package com.pi.saudememora.service;

import com.pi.saudememora.model.Paciente;
import com.pi.saudememora.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.stereotype.Service;
import com.pi.saudememora.util.funcoes;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;


@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

}
