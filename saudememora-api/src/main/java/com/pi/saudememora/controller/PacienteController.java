package com.pi.saudememora.controller;

import com.pi.saudememora.model.Documentos;
import com.pi.saudememora.model.FichaMedica;
import com.pi.saudememora.model.Paciente;
import com.pi.saudememora.repository.*;
import com.pi.saudememora.service.FichaMedicaService;
import com.pi.saudememora.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import com.pi.saudememora.util.funcoes;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import static javax.swing.UIManager.put;

@RestController
@RequestMapping("/api/paciente")
@CrossOrigin(origins = "*")
public class PacienteController {

    @Autowired
    private PacienteRepository pacienteRepository;


    @Autowired
    private PacienteService pacienteService;

    @Autowired
    private DocumentosRepository documentosRepository;

    @Autowired
    private ReceitaRepository receitaRepository;

    @Autowired
    private ExameRepository exameRepository;

    @Autowired
    private MedicamentoRepository medicamentoRepository;

    @Autowired
    private DocumentoClinicoRepository documentoClinicoRepository;

    @Autowired
    private FichaMedicaService fichaMedicaService;

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



    public void setPacienteRepository(PacienteRepository pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<?> adicionarPaciente(@RequestBody Paciente paciente) {

        if (pacienteRepository.existsByEmail(paciente.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new HashMap<String, Object>() {{
                        put("success", false);
                        put("message", "O email informado já está em uso.");
                    }});
        }

        if (pacienteRepository.existsByCpf(paciente.getCpf())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new HashMap<String, Object>() {{
                        put("success", false);
                        put("message", "O CPF informado já está em uso.");
                    }});
        }

        if (paciente.getSenha() != null && !paciente.getSenha().isEmpty()) {
            String senhaCriptografada = funcoes.criptografarSenha(paciente.getSenha());
            paciente.setSenha(senhaCriptografada);
        }

        Paciente pacienteSalvo = pacienteRepository.save(paciente);

        pacienteSalvo.setSenha("");

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new HashMap<String, Object>() {{
                    put("success", true);
                    put("message", "Paciente cadastrado com sucesso!");
                    put("dados", pacienteSalvo);
                }});
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
    @Transactional
    public ResponseEntity<Void> deletarPaciente(@PathVariable Long id) {
        try {
            Optional<Paciente> pacienteOpt = pacienteRepository.findById(id);
            if (pacienteOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // 1. Primeiro deletar todos os documentos relacionados
            List<Documentos> documentos = documentosRepository.findByPacienteId(id);
            for (Documentos documento : documentos) {
                // Deletar os registros relacionados baseados no tipo do documento
                switch (documento.getTipoDocumento().toUpperCase()) {
                    case "R": // Receita
                        medicamentoRepository.deleteByReceitaDocumentoId(documento.getId());
                        receitaRepository.deleteAllByDocumentoId(documento.getId());
                        break;
                    case "E": // Exame
                        exameRepository.deleteAllByDocumentoId(documento.getId());
                        break;
                    case "D": // Documento Clínico
                        documentoClinicoRepository.deleteAllByDocumentoId(documento.getId());
                        break;
                }
                documentosRepository.delete(documento);
            }

            // 2. Deletar a ficha médica se existir
            FichaMedica fichaMedica = fichaMedicaService.obterFichaMedicaPorUsuarioId(id);
            if (fichaMedica != null) {
                fichaMedicaService.deletarFichaMedica(fichaMedica.getId());
            }

            // 3. Finalmente deletar o paciente
            pacienteRepository.deleteById(id);

            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
