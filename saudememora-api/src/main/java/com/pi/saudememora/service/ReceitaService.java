package com.pi.saudememora.service;

import com.pi.saudememora.model.Receita;
import com.pi.saudememora.repository.ReceitaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReceitaService {

    private final ReceitaRepository receitaRepository;

    public ReceitaService(ReceitaRepository receitaRepository) {
        this.receitaRepository = receitaRepository;
    }

    // Método para criar uma nova receita
    public Receita createReceita(Receita receita) {
        return receitaRepository.save(receita);
    }

    // Método para buscar todas as receitas
    public List<Receita> getAllReceitas() {
        return receitaRepository.findAll();
    }

    // Método para deletar uma receita pelo ID
    public void deleteReceita(Long id) {
        if (!receitaRepository.existsById(id)) {
            throw new RuntimeException("Receita com ID " + id + " não encontrada.");
        }
        receitaRepository.deleteById(id);
    }
}