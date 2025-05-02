package com.pi.saudememora.controller;

import com.pi.saudememora.model.Paciente;
import com.pi.saudememora.repository.PacienteRepository;
import com.pi.saudememora.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.pi.saudememora.util.funcoes;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/paciente")
@CrossOrigin(origins = "*")
public class PacienteController {

    @Autowired
    private PacienteRepository pacienteRepository;


    @Autowired
    private PacienteService pacienteService;

    @PostMapping("/login")
    public Paciente login(@RequestBody Paciente loginData) {
        String senhaCriptografada = funcoes.criptografarSenha(loginData.getSenha());

        return pacienteRepository.findByEmail(loginData.getEmail())
                .filter(p -> p.getSenha().equals(senhaCriptografada))
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas"));
    }


    @GetMapping
    public List<Paciente> listarPacientes() {
        return pacienteRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paciente> buscarPaciente(@PathVariable Long id) {
        Optional<Paciente> paciente = pacienteRepository.findById(id);
        return paciente.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/cadastrar")
    public Paciente adicionarPaciente(@RequestBody Paciente paciente) {
        if (paciente.getSenha() != null && !paciente.getSenha().isEmpty()) {
            String senhaCriptografada = funcoes.criptografarSenha(paciente.getSenha());
            paciente.setSenha(senhaCriptografada);
        }

        return pacienteRepository.save(paciente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paciente> atualizarPaciente(@PathVariable Long id, @RequestBody Paciente paciente) {
        if (pacienteRepository.existsById(id)) {
            paciente.setId(id);
            Paciente updatedPaciente = pacienteRepository.save(paciente);
            return ResponseEntity.ok(updatedPaciente);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPaciente(@PathVariable Long id) {
        if (pacienteRepository.existsById(id)) {
            pacienteRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
