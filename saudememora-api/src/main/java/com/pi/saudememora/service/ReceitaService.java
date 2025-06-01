package com.pi.saudememora.service;

import com.pi.saudememora.model.Receita;
import com.pi.saudememora.repository.ReceitaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public Receita atualizarReceita(Receita receita) {
        try {
            // Verifica se a receita existe
            if (receita.getId() == null || !receitaRepository.existsById(receita.getId())) {
                logger.warn("Tentativa de atualizar receita não existente: ID {}", receita.getId());
                return null;
            }

            // Salva e retorna a receita atualizada
            return receitaRepository.save(receita);
        } catch (Exception e) {
            logger.error("Erro ao atualizar receita com ID {}", receita.getId(), e);
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