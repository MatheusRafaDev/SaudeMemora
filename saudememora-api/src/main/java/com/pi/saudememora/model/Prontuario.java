package com.pi.saudememora.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "tb_prontuario")
public class Prontuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_prontuario")
    private Long id;

    @Column(name = "nm_medico")
    private String medico;

    @Temporal(TemporalType.DATE)
    @Column(name = "dt_data")
    private Date data;

    @Column(name = "ds_especialidade")
    private String especialidade;

    @Column(name = "ds_observacoes", length = 2000)
    private String observacoes;

    @Column(name = "ds_conclusoes", length = 2000)
    private String conclusoes;

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMedico() {
        return medico;
    }

    public void setMedico(String medico) {
        this.medico = medico;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    public String getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(String especialidade) {
        this.especialidade = especialidade;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public String getConclusoes() {
        return conclusoes;
    }

    public void setConclusoes(String conclusoes) {
        this.conclusoes = conclusoes;
    }
}
