package com.pi.saudememora.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.pi.saudememora.model.Medicamento;
import com.pi.saudememora.repository.MedicamentoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/medicamentos")
public class MedicamentoController {

    private static final Logger logger = LoggerFactory.getLogger(MedicamentoController.class);

    private final MedicamentoRepository medicamentoRepository;

    public MedicamentoController(MedicamentoRepository medicamentoRepository) {
        this.medicamentoRepository = medicamentoRepository;
    }

    // 1) Criar um novo medicamento
    @PostMapping
    public ResponseEntity<?> createMedicamento(@RequestBody Medicamento medicamento) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(medicamento);
        logger.info("Recebido medicamento JSON: {}", json);

        try {
            Medicamento novoMedicamento = medicamentoRepository.save(medicamento);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoMedicamento);
        } catch (Exception e) {
            logger.error("Erro ao criar medicamento:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao criar medicamento: " + e.getMessage());
        }
    }

    // 2) Obter todos os medicamentos
    @GetMapping
    public ResponseEntity<List<Medicamento>> getAllMedicamentos() {
        List<Medicamento> medicamentos = medicamentoRepository.findAll();
        if (medicamentos.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(medicamentos);
    }

    // 3) Obter um medicamento pelo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getMedicamentoById(@PathVariable Long id) {
        return medicamentoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(500).body(null));
    }

    // 4) Atualizar um medicamento existente
    @PutMapping("/{id}")
    public ResponseEntity<Medicamento> updateMedicamento(@PathVariable Long id, @RequestBody Medicamento medicamentoDetails) {
        try {
            Optional<Medicamento> medicamentoOpt = medicamentoRepository.findById(id);
            if (medicamentoOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Medicamento medicamento = medicamentoOpt.get();
            if (medicamentoDetails.getNome() != null) {
                medicamento.setNome(medicamentoDetails.getNome());
            }
            if (medicamentoDetails.getQuantidade() != null) {
                medicamento.setQuantidade(medicamentoDetails.getQuantidade());
            }
            if (medicamentoDetails.getFormaDeUso() != null) {
                medicamento.setFormaDeUso(medicamentoDetails.getFormaDeUso());
            }

            Medicamento atualizado = medicamentoRepository.save(medicamento);
            return ResponseEntity.ok(atualizado);
        } catch (Exception e) {
            logger.error("Erro ao atualizar medicamento", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    // 5) Deletar um medicamento pelo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedicamento(@PathVariable Long id) {
        return medicamentoRepository.findById(id)
                .map(m -> {
                    medicamentoRepository.delete(m);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Medicamento não encontrado com o ID: " + id));
    }
}