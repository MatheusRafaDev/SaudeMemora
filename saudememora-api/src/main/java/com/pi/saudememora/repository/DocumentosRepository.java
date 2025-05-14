package com.pi.saudememora.repository;

import com.pi.saudememora.model.Documentos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentosRepository extends JpaRepository<Documentos, Long> {

    List<Documentos> findByTipoDocumento(String tipoDocumento);

    List<Documentos> findByPacienteId(Long id);

    List<Documentos> findByStatus(String status);
}
