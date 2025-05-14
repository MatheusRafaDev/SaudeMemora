package com.pi.saudememora.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "tb_exame")
public class Exame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_exame")
    private Long id;

    @Temporal(TemporalType.DATE)
    @Column(name = "dt_data")
    private Date data;

    @Column(name = "ds_tipo")
    private String tipo;

    @Column(name = "ds_laboratorio")
    private String laboratorio;

    @Column(name = "ds_resultado", length = 2000)
    private String resultado;

    @Column(name = "ds_observacoes", length = 2000)
    private String observacoes;

    // Relacionamento com a tabela Documentos
    @ManyToOne
    @JoinColumn(name = "id_documento", nullable = false)
    private Documentos documento;

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

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getLaboratorio() {
        return laboratorio;
    }

    public void setLaboratorio(String laboratorio) {
        this.laboratorio = laboratorio;
    }

    public String getResultado() {
        return resultado;
    }

    public void setResultado(String resultado) {
        this.resultado = resultado;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public Documentos getDocumento() {
        return documento;
    }

    public void setDocumento(Documentos documento) {
        this.documento = documento;
    }
}
