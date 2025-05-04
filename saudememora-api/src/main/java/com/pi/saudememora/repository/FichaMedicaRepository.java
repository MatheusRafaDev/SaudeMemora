package com.pi.saudememora.repository;


import com.pi.saudememora.model.FichaMedica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FichaMedicaRepository extends JpaRepository<FichaMedica, Long> {

}
