package com.pi.saudememora.repository;

import com.pi.saudememora.model.Medicamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicamentoRepository extends JpaRepository<Medicamento, Long> {
    // Adicione métodos customizados aqui, se necessário
}