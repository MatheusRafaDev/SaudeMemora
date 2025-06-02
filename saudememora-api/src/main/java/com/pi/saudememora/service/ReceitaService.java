package com.pi.saudememora.service;

import com.pi.saudememora.model.Medicamento;
import com.pi.saudememora.model.Receita;
import com.pi.saudememora.repository.ReceitaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ReceitaService {

    private static final Logger logger = LoggerFactory.getLogger(ReceitaService.class);

    private final ReceitaRepository receitaRepository;

    @Autowired
    public ReceitaService(ReceitaRepository receitaRepository) {
        this.receitaRepository = receitaRepository;
    }

    @Transactional
    public Receita atualizarReceitaComMedicamentos(Receita receitaAtualizada) {
        try {
            if (receitaAtualizada.getId() == null || !receitaRepository.existsById(receitaAtualizada.getId())) {
                logger.warn("Tentativa de atualizar receita não existente: ID {}", receitaAtualizada.getId());
                return null;
            }

            Receita receitaOriginal = receitaRepository.findById(receitaAtualizada.getId())
                    .orElseThrow(() -> new RuntimeException("Receita não encontrada"));

            receitaOriginal.setDataReceita(receitaAtualizada.getDataReceita());
            receitaOriginal.setCrmMedico(receitaAtualizada.getCrmMedico());
            receitaOriginal.setMedico(receitaAtualizada.getMedico());
            receitaOriginal.setObservacoes(receitaAtualizada.getObservacoes());
            receitaOriginal.setResumo(receitaAtualizada.getResumo());

            receitaOriginal.getMedicamentos().clear();
            for (Medicamento medicamento : receitaAtualizada.getMedicamentos()) {
                medicamento.setReceita(receitaOriginal);
                receitaOriginal.getMedicamentos().add(medicamento);
            }

            return receitaRepository.save(receitaOriginal);
        } catch (Exception e) {
            logger.error("Erro ao atualizar receita com ID {}", receitaAtualizada.getId(), e);
            throw new RuntimeException("Erro ao atualizar receita", e);
        }
    }


    // Outros métodos existentes (buscarPorId, createReceita, etc.)
    public Optional<Receita> buscarPorId(Long id) {
        return receitaRepository.findById(id);
    }

    public Receita createReceita(Receita receita) {
        return receitaRepository.save(receita);
    }

    public Optional<Receita> getReceitaById(Long id) {
        return receitaRepository.findById(id);
    }
}