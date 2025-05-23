package com.pi.saudememora.controller;

import com.pi.saudememora.model.Paciente;
import com.pi.saudememora.model.FichaMedica;
import com.pi.saudememora.service.PacienteService;
import com.pi.saudememora.service.FichaMedicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ficha-medica") // Mantendo o endpoint original
@CrossOrigin(origins = "*")
public class FichaMedicaController {

    private static final Logger logger = LoggerFactory.getLogger(FichaMedicaController.class);

    private final FichaMedicaService fichaMedicaService;
    private final PacienteService pacienteService;

    @Autowired
    public FichaMedicaController(FichaMedicaService fichaMedicaService, PacienteService pacienteService) {
        this.fichaMedicaService = fichaMedicaService;
        this.pacienteService = pacienteService;
    }

    @PostMapping("/cadastrar") // Mantendo o endpoint original
    public ResponseEntity<?> cadastrarFichaMedica(@RequestBody FichaMedica fichaMedica) {
        try {
            logger.info("Cadastrando nova ficha médica para paciente ID: {}",
                    fichaMedica.getPaciente() != null ? fichaMedica.getPaciente().getId() : "null");

            // Validação do paciente
            if (fichaMedica.getPaciente() == null || fichaMedica.getPaciente().getId() == null) {
                logger.warn("Tentativa de cadastro sem paciente associado");
                return ResponseEntity.badRequest().body("Paciente é obrigatório");
            }

            // Verifica existência do paciente
            Paciente paciente = pacienteService.buscarPorId(fichaMedica.getPaciente().getId());
            if (paciente == null) {
                logger.warn("Paciente não encontrado com ID: {}", fichaMedica.getPaciente().getId());
                return ResponseEntity.badRequest().body("Paciente não encontrado");
            }

            // Configura dados iniciais
            fichaMedica.setPaciente(paciente);
            fichaMedica.setDataCriacao(new Date());

            FichaMedica novaFicha = fichaMedicaService.salvarFichaMedica(fichaMedica);
            logger.info("Ficha médica criada com sucesso. ID: {}", novaFicha.getId());

            return ResponseEntity.status(HttpStatus.CREATED).body(novaFicha);
        } catch (Exception e) {
            logger.error("Erro ao cadastrar ficha médica", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ocorreu um erro ao cadastrar a ficha médica");
        }
    }

    @PutMapping("/atualizar/{id}") // Mantendo o endpoint original
    public ResponseEntity<?> atualizarFichaMedica(@PathVariable Long id, @RequestBody FichaMedica fichaAtualizada) {
        try {
            logger.info("Atualizando ficha médica ID: {}", id);

            // Validação do paciente
            if (fichaAtualizada.getPaciente() == null || fichaAtualizada.getPaciente().getId() == null) {
                logger.warn("Tentativa de atualização sem paciente associado");
                return ResponseEntity.badRequest().body("Paciente é obrigatório");
            }

            // Busca ficha existente
            Optional<FichaMedica> fichaExistenteOpt = fichaMedicaService.obterFichaMedicaPorId(id);
            if (!fichaExistenteOpt.isPresent()) {
                logger.warn("Ficha médica não encontrada com ID: {}", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ficha médica não encontrada");
            }

            // Verifica existência do paciente
            Paciente paciente = pacienteService.buscarPorId(fichaAtualizada.getPaciente().getId());
            if (paciente == null) {
                logger.warn("Paciente não encontrado com ID: {}", fichaAtualizada.getPaciente().getId());
                return ResponseEntity.badRequest().body("Paciente não encontrado");
            }

            FichaMedica fichaExistente = fichaExistenteOpt.get();
            atualizarCamposFicha(fichaExistente, fichaAtualizada);
            fichaExistente.setPaciente(paciente);

            FichaMedica fichaSalva = fichaMedicaService.salvarFichaMedica(fichaExistente);
            logger.info("Ficha médica ID {} atualizada com sucesso", id);

            return ResponseEntity.ok(fichaSalva);
        } catch (Exception e) {
            logger.error("Erro ao atualizar ficha médica ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ocorreu um erro ao atualizar a ficha médica");
        }
    }

    @GetMapping // Mantendo o endpoint original
    public ResponseEntity<List<FichaMedica>> obterTodasFichasMedicas() {
        logger.info("Listando todas as fichas médicas");
        List<FichaMedica> fichas = fichaMedicaService.obterTodasFichasMedicas();
        return ResponseEntity.ok(fichas);
    }

    @GetMapping("/{id}") // Mantendo o endpoint original
    public ResponseEntity<?> obterFichaMedicaPorId(@PathVariable Long id) {
        logger.info("Buscando ficha médica por ID: {}", id);
        Optional<FichaMedica> fichaOpt = fichaMedicaService.obterFichaMedicaPorId(id);
        return fichaOpt.map(ResponseEntity::ok)
                .orElseGet(() -> {
                    logger.warn("Ficha médica não encontrada com ID: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @GetMapping("/paciente/{id}") // Mantendo o endpoint original
    public ResponseEntity<?> obterFichaMedicaPorUsuarioId(@PathVariable Long id) {
        logger.info("Buscando ficha médica por paciente ID: {}", id);
        FichaMedica fichaMedica = fichaMedicaService.obterFichaMedicaPorUsuarioId(id);

        if (fichaMedica != null) {
            fichaMedica.setImagem(new byte[0]); // Limpa a imagem conforme original
            return ResponseEntity.ok(fichaMedica);
        }

        logger.warn("Nenhuma ficha médica encontrada para paciente ID: {}", id);
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/paciente/{id}/imagem") // Mantendo o endpoint original
    public ResponseEntity<byte[]> obterImagemFichaMedica(@PathVariable Long id) {
        logger.info("Buscando imagem da ficha médica do paciente ID: {}", id);
        FichaMedica ficha = fichaMedicaService.obterFichaMedicaPorUsuarioId(id);

        if (ficha == null || ficha.getImagem() == null || ficha.getImagem().length == 0) {
            logger.warn("Imagem não encontrada para paciente ID: {}", id);
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(ficha.getImagem());
    }

    @DeleteMapping("/{id}") // Mantendo o endpoint original
    public ResponseEntity<Void> deletarFichaMedica(@PathVariable Long id) {
        logger.info("Excluindo ficha médica ID: {}", id);
        if (fichaMedicaService.obterFichaMedicaPorId(id).isPresent()) {
            fichaMedicaService.deletarFichaMedica(id);
            logger.info("Ficha médica ID {} excluída com sucesso", id);
            return ResponseEntity.noContent().build();
        }

        logger.warn("Ficha médica não encontrada com ID: {}", id);
        return ResponseEntity.notFound().build();
    }

    // Método auxiliar para atualizar campos da ficha médica (mantido igual ao original)
    private void atualizarCamposFicha(FichaMedica fichaExistente, FichaMedica fichaAtualizada) {
        // Atualizar campos básicos
        fichaExistente.setImagem(fichaAtualizada.getImagem());
        fichaExistente.setOcrTexto(fichaAtualizada.getOcrTexto());
        fichaExistente.setPressao(fichaAtualizada.getPressao());

        // Atualizar campos booleanos (mantido igual ao original)
        fichaExistente.setTratamentoMedico(fichaAtualizada.isTratamentoMedico());
        fichaExistente.setTratamentoMedicoExtra(fichaAtualizada.getTratamentoMedicoExtra());
        fichaExistente.setGravidez(fichaAtualizada.isGravidez());
        fichaExistente.setGravidezExtra(fichaAtualizada.getGravidezExtra());
        fichaExistente.setRegime(fichaAtualizada.isRegime());
        fichaExistente.setRegimeExtra(fichaAtualizada.getRegimeExtra());
        fichaExistente.setDiabetes(fichaAtualizada.isDiabetes());
        fichaExistente.setDiabetesExtra(fichaAtualizada.getDiabetesExtra());
        fichaExistente.setAlergias(fichaAtualizada.isAlergias());
        fichaExistente.setAlergiasExtra(fichaAtualizada.getAlergiasExtra());
        fichaExistente.setReumatica(fichaAtualizada.isReumatica());
        fichaExistente.setCoagulacao(fichaAtualizada.isCoagulacao());
        fichaExistente.setDoencaCardioVascular(fichaAtualizada.isDoencaCardioVascular());
        fichaExistente.setDoencaCardioVascularExtra(fichaAtualizada.getDoencaCardioVascularExtra());
        fichaExistente.setHemorragicos(fichaAtualizada.isHemorragicos());
        fichaExistente.setProblemasAnestesia(fichaAtualizada.isProblemasAnestesia());
        fichaExistente.setProblemasAnestesiaExtra(fichaAtualizada.getProblemasAnestesiaExtra());
        fichaExistente.setAlergiaMedicamentos(fichaAtualizada.isAlergiaMedicamentos());
        fichaExistente.setAlergiaMedicamentosExtra(fichaAtualizada.getAlergiaMedicamentosExtra());
        fichaExistente.setHepatite(fichaAtualizada.isHepatite());
        fichaExistente.setHepatiteExtra(fichaAtualizada.getHepatiteExtra());
        fichaExistente.setHiv(fichaAtualizada.isHiv());
        fichaExistente.setDrogas(fichaAtualizada.isDrogas());
        fichaExistente.setFumante(fichaAtualizada.isFumante());
        fichaExistente.setFumou(fichaAtualizada.isFumou());
        fichaExistente.setRespiratorio(fichaAtualizada.isRespiratorio());
        fichaExistente.setRespiratorioExtra(fichaAtualizada.getRespiratorioExtra());
        fichaExistente.setDoencaFamilia(fichaAtualizada.isDoencaFamilia());
        fichaExistente.setDoencaFamiliaExtra(fichaAtualizada.getDoencaFamiliaExtra());
    }
}