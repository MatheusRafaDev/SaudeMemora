package com.pi.saudememora.repository;

import com.pi.saudememora.model.Prontuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProntuarioRepository extends JpaRepository<Prontuario, Long> {
    // Métodos adicionais de consulta podem ser adicionados aqui, se necessário.
}
