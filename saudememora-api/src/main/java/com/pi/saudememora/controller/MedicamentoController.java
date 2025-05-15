package com.pi.saudememora.controller;

import com.pi.saudememora.model.Medicamento;
import com.pi.saudememora.repository.MedicamentoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<?> createMedicamento(@RequestBody Medicamento medicamento) {
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
        return medicamentoRepository.findById(id)
                .map(medicamento -> {
                    // Atualiza os campos do medicamento existente
                    medicamento.setNome(medicamentoDetails.getNome());
                    medicamento.setQuantidade(medicamentoDetails.getQuantidade());
                    medicamento.setFormaDeUso(medicamentoDetails.getFormaDeUso());

                    // Salva as alterações no banco de dados
                    Medicamento atualizado = medicamentoRepository.save(medicamento);
                    return ResponseEntity.ok(atualizado); // Retorna o medicamento atualizado
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null)); // Mensagem clara de erro
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