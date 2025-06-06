package com.pi.saudememora.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "tb_documento_clinico")
public class DocumentoClinico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_documento_clinico")
    private Long id;

    @Column(name = "nm_medico", nullable = false)
    private String medico;

    @Column(name = "ds_especialidade")
    private String especialidade;

    @Column(name = "ds_tipo")
    private String tipo;

    @Column(name = "ds_observacoes", length = 2000)
    private String observacoes;

    @Column(name = "ds_conclusoes", length = 2000)
    private String conclusoes;

    @Column(name = "ds_imagem")
    private String imagem;

    
    @Column(name = "ds_resumo", columnDefinition = "TEXT")
    private String resumo;

    @ManyToOne
    @JoinColumn(name = "id_documento", nullable = false)
    private Documentos documento;

    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;

    @Column(name = "ds_conteudo", length = 5000)
    private String conteudo;


    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Column(name = "dt_inclusao", nullable = false, updatable = false)
    private LocalDate dataInclusao;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Column(name = "dt_documentocli", nullable = false)
    private LocalDate dataDocumentoCli;

    @PrePersist
    protected void onCreate() {
        this.dataInclusao = LocalDate.now();
    }

    public String getConteudo() {
        return conteudo;
    }

    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }

    public Long getId() {
        return id;
    }

    public String getResumo() {
        return resumo;
    }

    public void setResumo(String resumo) {
        this.resumo = resumo;
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

    public String getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(String especialidade) {
        this.especialidade = especialidade;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public LocalDate getDataDocumentoCli() {
        return dataDocumentoCli;
    }

    public void setDataDocumentoCli(LocalDate dataDocumentoCli) {
        this.dataDocumentoCli = dataDocumentoCli;
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

    public String getImagem() {
        return imagem;
    }

    public void setImagem(String imagem) {
        this.imagem = imagem;
    }


    public Documentos getDocumento() {
        return documento;
    }

    public void setDocumento(Documentos documento) {
        this.documento = documento;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    public LocalDate getDataInclusao() {
        return dataInclusao;
    }

    public void setDataInclusao(LocalDate dataInclusao) {
        this.dataInclusao = dataInclusao;
    }
}
