package com.pi.saudememora.repository;


import com.pi.saudememora.model.FichaMedica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FichaMedicaRepository extends JpaRepository<FichaMedica, Long> {
    FichaMedica findByPaciente_Id(Long pacienteId);
}
