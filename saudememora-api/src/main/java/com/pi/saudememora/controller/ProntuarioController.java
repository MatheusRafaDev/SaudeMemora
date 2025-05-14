package com.pi.saudememora.controller;

import com.pi.saudememora.model.Prontuario;
import com.pi.saudememora.service.ProntuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/prontuarios")
public class ProntuarioController {

    @Autowired
    private ProntuarioService prontuarioService;

    // Criar Prontuário
    @PostMapping
    public ResponseEntity<Prontuario> criarProntuario(@RequestBody Prontuario prontuario) {
        try {
            // Atribui diretamente o documento ao prontuário
            Prontuario novoProntuario = prontuarioService.save(prontuario);
            return new ResponseEntity<>(novoProntuario, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Consultar Prontuário por ID
    @GetMapping("/{id}")
    public ResponseEntity<Prontuario> getProntuarioById(@PathVariable("id") Long id) {
        try {
            Prontuario prontuario = prontuarioService.findById(id);
            if (prontuario != null) {
                return new ResponseEntity<>(prontuario, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Atualizar Prontuário
    @PutMapping("/{id}")
    public ResponseEntity<Prontuario> atualizarProntuario(@PathVariable("id") Long id, @RequestBody Prontuario prontuario) {
        try {
            // Verifica se o prontuário existe
            Prontuario prontuarioExistente = prontuarioService.findById(id);
            if (prontuarioExistente != null) {
                prontuario.setId(id);  // Atualiza o ID do prontuário
                Prontuario prontuarioAtualizado = prontuarioService.save(prontuario);
                return new ResponseEntity<>(prontuarioAtualizado, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Deletar Prontuário
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletarProntuario(@PathVariable("id") Long id) {
        try {
            // Verifica se o prontuário existe
            Prontuario prontuarioExistente = prontuarioService.findById(id);
            if (prontuarioExistente != null) {
                prontuarioService.delete(id);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
