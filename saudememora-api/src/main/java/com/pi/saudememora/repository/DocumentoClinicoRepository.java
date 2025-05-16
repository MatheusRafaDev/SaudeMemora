package com.pi.saudememora.repository;

import com.pi.saudememora.model.DocumentoClinico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentoClinicoRepository extends JpaRepository<DocumentoClinico, Long> {
    List<DocumentoClinico> findByPacienteId(Long pacienteId);
    DocumentoClinico findByDocumentoId(Long documentoId);
}
