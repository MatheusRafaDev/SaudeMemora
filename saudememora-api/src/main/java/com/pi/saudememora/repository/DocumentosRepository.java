package com.pi.saudememora.repository;

import com.pi.saudememora.model.Documentos;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DocumentosRepository extends JpaRepository<Documentos, Long> {
    Optional<Documentos> findAllOptional(Documentos documento);

}
