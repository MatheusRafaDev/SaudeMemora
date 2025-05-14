package com.pi.saudememora.controller;

import com.pi.saudememora.model.Exame;
import com.pi.saudememora.model.Documentos;
import com.pi.saudememora.service.ExameService;
import com.pi.saudememora.service.DocumentosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/exames")
public class ExameController {

    @Autowired
    private ExameService exameService;

    @Autowired
    private DocumentosService documentosService;


    @PostMapping
    public ResponseEntity<Exame> criarExame(@RequestBody Exame exame) {
        try {
            Exame novoExame = exameService.save(exame);
            return new ResponseEntity<>(novoExame, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Obter todos os exames
    @GetMapping
    public ResponseEntity<List<Exame>> listarExames() {
        try {
            List<Exame> exames = exameService.findAll();
            if (exames.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(exames, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Obter exame por ID
    @GetMapping("/{id}")
    public ResponseEntity<Exame> obterExame(@PathVariable("id") Long id) {
        Optional<Exame> exame = exameService.findById(id);
        if (exame.isPresent()) {
            return new ResponseEntity<>(exame.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Atualizar Exame
    @PutMapping("/{id}")
    public ResponseEntity<Exame> atualizarExame(@PathVariable("id") Long id, @RequestBody Exame exame) {
        Optional<Exame> exameExistente = exameService.findById(id);
        if (!exameExistente.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Atualizar os dados do exame
        Exame exameAtualizado = exameExistente.get();
        exameAtualizado.setData(exame.getData());
        exameAtualizado.setTipo(exame.getTipo());
        exameAtualizado.setLaboratorio(exame.getLaboratorio());
        exameAtualizado.setResultado(exame.getResultado());
        exameAtualizado.setObservacoes(exame.getObservacoes());

        // Atualizar o documento associado
        Optional<Documentos> documento = documentosService.findById(exame.getDocumento().getId());
        if (documento.isPresent()) {
            exameAtualizado.setDocumento(documento.get());
        }

        Exame exameSalvo = exameService.save(exameAtualizado);
        return new ResponseEntity<>(exameSalvo, HttpStatus.OK);
    }

    // Deletar Exame
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> excluirExame(@PathVariable("id") Long id) {
        try {
            exameService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
