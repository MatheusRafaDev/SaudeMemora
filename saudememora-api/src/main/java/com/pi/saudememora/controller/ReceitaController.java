package com.pi.saudememora.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pi.saudememora.model.Receita;
import com.pi.saudememora.repository.ReceitaRepository;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/receitas")
public class ReceitaController {

    @Autowired
    private ReceitaRepository receitaRepository;

    /**
     * Criar uma nova receita
     *
     * @param receita Objeto receita enviado no corpo da requisição
     * @return Receita criada
     */
    @PostMapping
    public ResponseEntity<?> createReceita(@RequestBody Receita receita) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonReceita = objectMapper.writeValueAsString(receita);

            // Loga o JSON da receita
            Logger logger = LoggerFactory.getLogger(getClass());
            logger.info("JSON Recebido: {}", jsonReceita); // Passa o jsonReceita aqui

            // Verifica se os campos obrigatórios estão preenchidos
            if (receita.getNomeMedico() == null || receita.getNomeMedico().isEmpty()) {
                return ResponseEntity.badRequest().body("O campo 'nomeMedico' é obrigatório.");
            }
            if (receita.getNomeMedicamento() == null || receita.getNomeMedicamento().isEmpty()) {
                return ResponseEntity.badRequest().body("O campo 'nomeMedicamento' é obrigatório.");
            }
            if (receita.getPosologia() == null || receita.getPosologia().isEmpty()) {
                return ResponseEntity.badRequest().body("O campo 'posologia' é obrigatório.");
            }

            // Salva a receita no banco de dados
            Receita novaReceita = receitaRepository.save(receita);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaReceita);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao criar receita: " + e.getMessage());
        }
    }

    /**
     * Obter todas as receitas
     *
     * @return Lista de receitas
     */
    @GetMapping
    public ResponseEntity<List<Receita>> getAllReceitas() {
        try {
            List<Receita> receitas = receitaRepository.findAll();
            if (receitas.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(receitas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obter uma receita pelo ID
     *
     * @param id ID da receita
     * @return Receita correspondente ao ID ou 404 se não encontrada
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getReceitaById(@PathVariable Long id) {
        return receitaRepository.findById(id)
                .<ResponseEntity<?>>map(receita -> ResponseEntity.ok(receita)) // Retorna 200 com a receita
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Receita não encontrada com o ID: " + id)); // Retorna 404 com mensagem de erro
    }

    /**
     * Atualizar uma receita existente
     *
     * @param id             ID da receita a ser atualizada
     * @param receitaDetails Detalhes atualizados da receita
     * @return Receita atualizada ou 404 se não encontrada
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateReceita(@PathVariable Long id, @RequestBody Receita receitaDetails) {
        return receitaRepository.findById(id)
                .map(receita -> {
                    try {
                        // Atualiza os campos da receita
                        receita.setNomeMedico(receitaDetails.getNomeMedico());
                        receita.setNomeMedicamento(receitaDetails.getNomeMedicamento());
                        receita.setPosologia(receitaDetails.getPosologia());
                        receita.setObservacoes(receitaDetails.getObservacoes());
                        receita.setResumo(receitaDetails.getResumo());
                        receita.setImagem(receitaDetails.getImagem());
                        receita.setPaciente(receitaDetails.getPaciente());
                        receita.setDocumento(receitaDetails.getDocumento());

                        Receita updatedReceita = receitaRepository.save(receita);
                        return ResponseEntity.ok(updatedReceita);
                    } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao atualizar receita: " + e.getMessage());
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Receita não encontrada com o ID: " + id));
    }

    /**
     * Deletar uma receita pelo ID
     *
     * @param id ID da receita a ser deletada
     * @return Resposta de sucesso ou 404 se não encontrada
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReceita(@PathVariable Long id) {
        return receitaRepository.findById(id)
                .map(receita -> {
                    try {
                        receitaRepository.delete(receita);
                        return ResponseEntity.noContent().build();
                    } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao deletar receita: " + e.getMessage());
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Receita não encontrada com o ID: " + id));
    }
}