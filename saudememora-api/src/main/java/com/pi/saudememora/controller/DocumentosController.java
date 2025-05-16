package com.pi.saudememora.controller;

import com.pi.saudememora.model.Documentos;
import com.pi.saudememora.repository.*;
import com.pi.saudememora.service.DocumentosService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/documentos")
@CrossOrigin(origins = "*")
public class DocumentosController {

    private static final Logger logger = LoggerFactory.getLogger(DocumentosController.class);

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
    private DocumentosService documentosService;

    // GET por ID
    @GetMapping("/{id}")
    public ResponseEntity<Documentos> getDocumentoById(@PathVariable Long id) {
        return documentosRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // GET por ID do paciente
    @GetMapping("/paciente/{id}")
    public ResponseEntity<List<Documentos>> getDocumentosPorPaciente(@PathVariable Long id) {
        logger.info("Buscando documentos para o paciente com ID: {}", id);
        List<Documentos> documentos = documentosRepository.findByPacienteId(id);
        return ResponseEntity.ok(documentos);
    }

    // GET por Tipo de Documento (Ex: R, E, P)
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Documentos>> getDocumentosPorTipo(@PathVariable String tipo) {
        logger.info("Buscando documentos do tipo: {}", tipo);
        List<Documentos> documentos = documentosRepository.findByTipoDocumento(tipo.toUpperCase());
        return ResponseEntity.ok(documentos);
    }



    @PostMapping
    public ResponseEntity<Documentos> createDocumento(@RequestBody Documentos documento) {
        logger.info("Recebendo requisição para criar documento: {}", documento);
        try {
            if (documento.getDataUpload() == null) {
                documento.setDataUpload(new Date());
                logger.info("Data de upload definida como data atual: {}", documento.getDataUpload());
            }

            Documentos novoDocumento = documentosRepository.save(documento);
            return ResponseEntity.status(201).body(novoDocumento);
        } catch (Exception e) {
            logger.error("Erro ao criar documento: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(null);
        }
    }

    // PUT - Atualizar um documento existente
    @PutMapping("/{id}")
    public ResponseEntity<Documentos> updateDocumento(@PathVariable Long id,
                                                      @RequestBody Documentos documentoAtualizado) {
        return documentosRepository.findById(id)
                .map(documento -> {
                    documento.setTipoDocumento(documentoAtualizado.getTipoDocumento());
                    documento.setStatus(documentoAtualizado.getStatus());
                    documento.setDataUpload(documentoAtualizado.getDataUpload());
                    documento.setPaciente(documentoAtualizado.getPaciente());
                    Documentos documentoSalvo = documentosRepository.save(documento);
                    return ResponseEntity.ok(documentoSalvo);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Documentos>> getTodosDocumentos() {
        logger.info("Buscando todos os documentos");
        List<Documentos> documentos = documentosRepository.findAll();
        return ResponseEntity.ok(documentos);
    }

    // DELETE - Deletar documento por tipo e id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarDocumento(@PathVariable Long id,
                                                 @RequestParam("tipo") String tipo) {
        try {
            if (!documentosRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }

            switch (tipo.toUpperCase()) {
                case "R":
                    medicamentoRepository.deleteByReceitaDocumentoId(id);
                    receitaRepository.deleteAllByDocumentoId(id);
                    break;
                case "E":
                    exameRepository.deleteAllByDocumentoId(id);
                    break;
                case "D":
                    documentoClinicoRepository.deleteAllByDocumentoId(id);
                    break;
                default:
                    return ResponseEntity.badRequest().build();
            }

            documentosRepository.deleteById(id);
            return ResponseEntity.noContent().build();

        } catch (DataIntegrityViolationException e) {
            logger.error("Erro de integridade ao deletar documento", e);
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            logger.error("Erro ao deletar documento", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
