package com.pi.saudememora.service;

import com.pi.saudememora.model.FichaMedica;
import com.pi.saudememora.repository.FichaMedicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
public class FichaMedicaService {

    @Autowired
    private FichaMedicaRepository fichaMedicaRepository;

    public FichaMedica salvarFichaMedica(FichaMedica fichaMedica) {
        return fichaMedicaRepository.save(fichaMedica);
    }

    public FichaMedica obterFichaMedicaPorUsuarioId(Long idPaciente) {
        FichaMedica fichaMedica = fichaMedicaRepository.findByPaciente_Id(idPaciente);
        return fichaMedica;
    }

    public List<FichaMedica> obterTodasFichasMedicas() {
        return fichaMedicaRepository.findAll();
    }


    public Optional<FichaMedica> obterFichaMedicaPorId(Long id) {
        return fichaMedicaRepository.findById(id);
    }

    public void deletarFichaMedica(Long id) {
        fichaMedicaRepository.deleteById(id);
    }
}
