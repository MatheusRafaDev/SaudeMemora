package com.pi.saudememora.repository;

import com.pi.saudememora.model.Documentos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentosRepository extends JpaRepository<Documentos, Long> {

    List<Documentos> findByTipoDocumento(String tipoDocumento);

    List<Documentos> findByPacienteId(Long id);

    List<Documentos> findByStatus(String status);

    @Query("SELECT d FROM Documentos d " +
            "WHERE d.status = :status AND d.tipoDocumento = :tipo AND d.dataUpload >= :data " +
            "ORDER BY d.dataUpload DESC")
    List<Documentos> filtrarPorStatusTipoEData(@Param("status") String status,
                                               @Param("tipo") String tipo,
                                               @Param("data") Date dataUpload);

    @Query("SELECT d FROM Documentos d " +
            "WHERE d.status = :status AND d.tipoDocumento = :tipo " +
            "ORDER BY d.dataUpload DESC")
    List<Documentos> filtrarPorStatusETipo(@Param("status") String status,
                                           @Param("tipo") String tipo);

}
