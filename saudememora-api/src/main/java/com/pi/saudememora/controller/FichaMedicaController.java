package com.pi.saudememora.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.pi.saudememora.model.Paciente;
import com.pi.saudememora.service.PacienteService;
import com.pi.saudememora.model.FichaMedica;
import com.pi.saudememora.service.FichaMedicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

@RestController
@RequestMapping("/api/ficha-medica")
@CrossOrigin(origins = "*")
public class FichaMedicaController {

    @Autowired
    private FichaMedicaService fichaMedicaService;

    @Autowired
    private PacienteService pacienteService;


    @PostMapping("/cadastrar")
    public Object cadastrarFichaMedica(@RequestBody FichaMedica fichaMedica) throws JsonProcessingException {

        ObjectMapper mapper = new ObjectMapper();
        mapper.enable(SerializationFeature.INDENT_OUTPUT);


        String json = mapper.writeValueAsString(fichaMedica);
        //System.out.println("FichaMedica completa:\n" + json);

        if (fichaMedica.getPaciente() == null || fichaMedica.getPaciente().getId() == null) {
            return ResponseEntity.badRequest().body("Paciente é obrigatório" + fichaMedica);
        }



        //Logger logger = LoggerFactory.getLogger(FichaMedicaController.class);
        //logger.info("Corpo da requisição: {}", fichaMedica);


        Paciente paciente = pacienteService.buscarPorId(fichaMedica.getPacienteId());
        fichaMedica.setPaciente(paciente);

        fichaMedica.setDataCriacao(new Date());

        FichaMedica novaFicha = fichaMedicaService.salvarFichaMedica(fichaMedica);

        return new ResponseEntity<>(novaFicha, HttpStatus.CREATED);
    }

    @PutMapping("/atualizar/{id}")
    public Object atualizarFichaMedica(@PathVariable Long id, @RequestBody FichaMedica fichaRecebida) {

        if (fichaRecebida.getPaciente() == null || fichaRecebida.getPaciente().getId() == null) {
            return ResponseEntity.badRequest().body("Paciente é obrigatório");
        }

        Optional<FichaMedica> optionalFicha = fichaMedicaService.obterFichaMedicaPorId(id);
        if (!optionalFicha.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ficha médica não encontrada");
        }

        // Recupera a ficha existente
        FichaMedica fichaExistente = optionalFicha.get();

        // Atualiza os dados com base no que foi enviado do front
        fichaExistente.setImagem(fichaRecebida.getImagem());
        fichaExistente.setOcrTexto(fichaRecebida.getOcrTexto());

        fichaExistente.setPressao(fichaRecebida.getPressao());
        fichaExistente.setTratamentoMedico(fichaRecebida.isTratamentoMedico());
        fichaExistente.setGravidez(fichaRecebida.isGravidez());
        fichaExistente.setRegime(fichaRecebida.isRegime());
        fichaExistente.setDiabetes(fichaRecebida.isDiabetes());
        fichaExistente.setAlergias(fichaRecebida.isAlergias());
        fichaExistente.setFebreReumatica(fichaRecebida.isFebreReumatica());
        fichaExistente.setCoagulacao(fichaRecebida.isCoagulacao());
        fichaExistente.setDoencaCardioVascular(fichaRecebida.isDoencaCardioVascular());
        fichaExistente.setHemorragicos(fichaRecebida.isHemorragicos());
        fichaExistente.setProblemasAnestesia(fichaRecebida.isProblemasAnestesia());
        fichaExistente.setAlergiaMedicamentos(fichaRecebida.isAlergiaMedicamentos());
        fichaExistente.setHepatite(fichaRecebida.isHepatite());
        fichaExistente.setHiv(fichaRecebida.isHiv());
        fichaExistente.setDrogas(fichaRecebida.isDrogas());
        fichaExistente.setFumante(fichaRecebida.isFumante());
        fichaExistente.setFumou(fichaRecebida.isFumou());
        fichaExistente.setRespiratorios(fichaRecebida.isRespiratorios());

        // Atualiza paciente (caso necessário buscar novamente pelo ID)
        Paciente paciente = pacienteService.buscarPorId(fichaRecebida.getPaciente().getId());
        fichaExistente.setPaciente(paciente);

        FichaMedica fichaAtualizada = fichaMedicaService.salvarFichaMedica(fichaExistente);

        return new ResponseEntity<>(fichaAtualizada, HttpStatus.OK);
    }


    @GetMapping
    public ResponseEntity<List<FichaMedica>> obterTodasFichasMedicas() {
        List<FichaMedica> fichasMedicas = fichaMedicaService.obterTodasFichasMedicas();
        return new ResponseEntity<>(fichasMedicas, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FichaMedica> obterFichaMedicaPorId(@PathVariable Long id) {
        Optional<FichaMedica> fichaMedica = fichaMedicaService.obterFichaMedicaPorId(id);
        if (fichaMedica.isPresent()) {
            return new ResponseEntity<>(fichaMedica.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/paciente/{id}")
    public ResponseEntity<FichaMedica> obterFichaMedicaPorUsuarioId(@PathVariable Long id) {

        FichaMedica fichaMedica = fichaMedicaService.obterFichaMedicaPorUsuarioId(id);

        fichaMedica.setImagem(new byte[0]);

        if (fichaMedica != null) {
            return new ResponseEntity<>(fichaMedica, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /*
        @CrossOrigin(origins = "http://localhost:3000")
        @GetMapping("/paciente/{id}/imagem")
        public ResponseEntity<byte[]> obterImagemFichaMedica(@PathVariable Long id) {
            FichaMedica ficha = fichaMedicaService.obterFichaMedicaPorUsuarioId(id);

            if (ficha != null && ficha.getImagem() != null && ficha.getImagem().length > 0) {
                return ResponseEntity
                        .ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(ficha.getImagem());
            } else {
                return ResponseEntity.noContent().build();
            }
        }
    */


    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/paciente/{id}/imagem")
    public ResponseEntity<byte[]> obterImagemFichaMedica(@PathVariable Long id) {
        FichaMedica ficha = fichaMedicaService.obterFichaMedicaPorUsuarioId(id);

        // Verifica se a ficha médica ou a imagem são nulas ou vazias
        if (ficha == null || ficha.getImagem() == null || ficha.getImagem().length == 0) {
            return ResponseEntity.noContent().build(); // Retorna "No Content" caso não haja imagem
        }

        // Retorna a imagem diretamente na resposta
        return ResponseEntity
                .ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(ficha.getImagem());
    }

    /*
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/paciente/{id}/imagem")
    public ResponseEntity<byte[]> obterImagemFichaMedica(@PathVariable Long id) {
        FichaMedica ficha = fichaMedicaService.obterFichaMedicaPorUsuarioId(id);

        if (ficha == null || ficha.getImagem() == null || ficha.getImagem().length == 0) {
            return ResponseEntity.noContent().build();
        }

        try {
            String pastaDestino = "uploads/imagens/";
            Files.createDirectories(Paths.get(pastaDestino));

            String nomeArquivo = "ficha_paciente_" + id + ".jpg";
            Path caminhoCompleto = Paths.get(pastaDestino, nomeArquivo);

            Files.write(caminhoCompleto, ficha.getImagem());

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity
                .ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(ficha.getImagem());
    }
    */

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarFichaMedica(@PathVariable Long id) {
        Optional<FichaMedica> fichaExistente = fichaMedicaService.obterFichaMedicaPorId(id);
        if (fichaExistente.isPresent()) {
            fichaMedicaService.deletarFichaMedica(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
