package com.pi.saudememora.service;

import com.pi.saudememora.model.Exame;
import com.pi.saudememora.repository.ExameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExameService {

    @Autowired
    private ExameRepository exameRepository;

    public Exame save(Exame exame) {
        return exameRepository.save(exame);
    }

    public List<Exame> findAll() {
        return exameRepository.findAll();
    }

    public Optional<Exame> findById(Long id) {
        return exameRepository.findById(id);
    }

    public void deleteById(Long id) {
        exameRepository.deleteById(id);
    }
}
