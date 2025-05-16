package com.pi.saudememora.repository;

import com.pi.saudememora.model.Documentos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface DocumentosRepository extends JpaRepository<Documentos, Long> {
    Optional<Documentos> findByStatusAndTipoDocumentoAndDataUpload(String status, String tipoDocumento, String dataUpload);


}
