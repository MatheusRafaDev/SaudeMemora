package com.pi.saudememora.service;

import com.pi.saudememora.model.Receita;
import com.pi.saudememora.model.Medicamento;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

public class IAService {
    private final OCRProcessor ocrProcessor;

    public IAService(OCRProcessor ocrProcessor) {
        this.ocrProcessor = ocrProcessor;
    }

    public Map<String, Object> tratarTextoReceita(String textoOCR) throws Exception {
        Receita receita = ocrProcessor.tratarOCRParaReceitas(textoOCR);

        Map<String, Object> response = new HashMap<>();
        response.put("id", receita.getId());
        response.put("medico", receita.getMedico());
        response.put("crmMedico", receita.getCrmMedico());
        response.put("posologia", receita.getPosologia());
        response.put("observacoes", receita.getObservacoes());
        response.put("resumo", receita.getResumo());
        response.put("imagem", receita.getImagem());
        response.put("dataReceita", receita.getDataReceita());
        response.put("dataInclusao", receita.getDataInclusao());

        if (receita.getMedicamentos() != null) {
            List<Map<String, String>> medicamentosList = receita.getMedicamentos()
                    .stream()
                    .map(this::mapMedicamentoToDto)
                    .collect(Collectors.toList());
            response.put("medicamentos", medicamentosList);
        }

        // Add documento info if exists
        if (receita.getDocumento() != null) {
            response.put("documento", Map.of(
                    "id", receita.getDocumento().getId(),
                    "tipo", receita.getDocumento().getTipoDocumento()
            ));
        }

        // Add paciente info if exists
        if (receita.getPaciente() != null) {
            response.put("paciente", Map.of(
                    "id", receita.getPaciente().getId(),
                    "nome", receita.getPaciente().getNome()
            ));
        }

        return response;
    }

    private Map<String, String> mapMedicamentoToDto(Medicamento medicamento) {
        Map<String, String> medicamentoMap = new HashMap<>();
        medicamentoMap.put("nome", medicamento.getNome());
        medicamentoMap.put("quantidade", medicamento.getQuantidade());
        medicamentoMap.put("formaDeUso", medicamento.getFormaDeUso());
        return medicamentoMap;
    }

    public Map<String, Object> tratarTextoExame(String textoOCR) {
        // Implementation for exam processing
        return Map.of();
    }

    public Map<String, Object> tratarTextoDocumentoClinico(String textoOCR) {
        // Implementation for clinical documents
        return Map.of();
    }
}