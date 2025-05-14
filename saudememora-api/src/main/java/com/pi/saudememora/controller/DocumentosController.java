package com.pi.saudememora.controller;

import com.pi.saudememora.model.Documentos;
import com.pi.saudememora.repository.DocumentosRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/documentos")
@CrossOrigin(origins = "*") // Libera o CORS para testes locais
public class DocumentosController {

    private static final Logger logger = LoggerFactory.getLogger(DocumentosController.class);

    @Autowired
    private DocumentosRepository documentosRepository;

    // GET por ID
    @GetMapping("/{id}")
    public ResponseEntity<Documentos> getDocumentoById(@PathVariable Long id) {

        return documentosRepository.findById(id)
                .map(documento -> {

                    return ResponseEntity.ok(documento);
                })
                .orElseGet(() -> {

                    return ResponseEntity.notFound().build();
                });
    }

    // GET por ID do paciente
    @GetMapping("/paciente/{id}")
    public ResponseEntity<List<Documentos>> getDocumentosPorPaciente(@PathVariable Long id) {
        logger.info("Buscando documentos para o paciente com ID: {}", id);
        List<Documentos> documentos = documentosRepository.findByPacienteId(id);
        if (documentos.isEmpty()) {
            logger.warn("Nenhum documento encontrado para o paciente com ID: {}", id);
        } else {
            logger.info("Documentos encontrados para o paciente com ID {}: {}", id, documentos.size());
        }
        return ResponseEntity.ok(documentos);
    }

    // GET por Tipo de Documento (Ex: R, E, P)
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Documentos>> getDocumentosPorTipo(@PathVariable String tipo) {
        logger.info("Buscando documentos do tipo: {}", tipo);
        List<Documentos> documentos = documentosRepository.findByTipoDocumento(tipo.toUpperCase());
        if (documentos.isEmpty()) {
            logger.warn("Nenhum documento encontrado para o tipo: {}", tipo);
        } else {
            logger.info("Documentos encontrados para o tipo {}: {}", tipo, documentos.size());
        }
        return ResponseEntity.ok(documentos);
    }

    // POST - Criar um novo documento
    @PostMapping
    public ResponseEntity<Documentos> createDocumento(@RequestBody Documentos documento) {
        logger.info("Recebendo requisição para criar documento: {}", documento);
        try {
            // Define a data de upload como a data atual, se não for fornecida
            if (documento.getDataUpload() == null) {
                documento.setDataUpload(new Date());
                logger.info("Data de upload não fornecida. Definindo data atual: {}", documento.getDataUpload());
            }

            // Salva o documento no banco de dados
            Documentos novoDocumento = documentosRepository.save(documento);
            logger.info("Documento criado com sucesso: {}", novoDocumento);

            return ResponseEntity.status(201).body(novoDocumento); // Retorna 201 Created
        } catch (Exception e) {
            logger.error("Erro ao criar documento: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(null); // Retorna erro interno do servidor
        }
    }

    // PUT - Atualizar um documento existente
    @PutMapping("/{id}")
    public ResponseEntity<Documentos> updateDocumento(
            @PathVariable Long id,
            @RequestBody Documentos documentoAtualizado) {
        logger.info("Recebendo requisição para atualizar documento com ID: {}", id);
        return documentosRepository.findById(id)
                .map(documento -> {
                    // Atualiza os campos do documento
                    logger.info("Documento encontrado. Atualizando campos...");
                    documento.setTipoDocumento(documentoAtualizado.getTipoDocumento());
                    documento.setStatus(documentoAtualizado.getStatus());
                    documento.setDataUpload(documentoAtualizado.getDataUpload());
                    documento.setPaciente(documentoAtualizado.getPaciente());

                    Documentos documentoSalvo = documentosRepository.save(documento);
                    logger.info("Documento atualizado com sucesso: {}", documentoSalvo);
                    return ResponseEntity.ok(documentoSalvo); // Retorna 200 OK
                })
                .orElseGet(() -> {
                    logger.warn("Documento com ID {} não encontrado para atualização.", id);
                    return ResponseEntity.notFound().build(); // Retorna 404 se o documento não for encontrado
                });
    }
}