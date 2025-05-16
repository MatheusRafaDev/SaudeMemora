package com.pi.saudememora.repository;

import com.pi.saudememora.model.DocumentoClinico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface DocumentoClinicoRepository extends JpaRepository<DocumentoClinico, Long> {
    List<DocumentoClinico> findByPacienteId(Long pacienteId);
    List<DocumentoClinico> findByDocumentoId(Long documentoId);

    @Transactional
    @Modifying
    @Query("DELETE FROM DocumentoClinico d WHERE d.documento.id = :documentoId")
    void deleteAllByDocumentoId(Long documentoId);
}
