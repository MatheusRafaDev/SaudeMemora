package com.pi.saudememora.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "tb_receita")
public class Receita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_receita")
    private Long id;

    @Temporal(TemporalType.DATE)
    @Column(name = "dt_data")
    private Date data;

    @Column(name = "ds_medico")
    private String medico;

    @Column(name = "ds_medicamentos", length = 1000)
    private String medicamentos;

    @Column(name = "ds_posologia", length = 1000)
    private String posologia;

    @Column(name = "ds_observacoes", length = 1000)
    private String observacoes;

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    public String getMedico() {
        return medico;
    }

    public void setMedico(String medico) {
        this.medico = medico;
    }

    public String getMedicamentos() {
        return medicamentos;
    }

    public void setMedicamentos(String medicamentos) {
        this.medicamentos = medicamentos;
    }

    public String getPosologia() {
        return posologia;
    }

    public void setPosologia(String posologia) {
        this.posologia = posologia;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
}
