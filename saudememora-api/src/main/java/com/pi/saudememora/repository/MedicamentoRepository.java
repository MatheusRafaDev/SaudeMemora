package com.pi.saudememora.repository;

import com.pi.saudememora.model.Medicamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface MedicamentoRepository extends JpaRepository<Medicamento, Long> {

    List<Medicamento> findByReceitaId(Long receitaId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Medicamento m WHERE m.receita.documento.id = :documentoId")
    void deleteByReceitaDocumentoId(@Param("documentoId") Long documentoId);
}