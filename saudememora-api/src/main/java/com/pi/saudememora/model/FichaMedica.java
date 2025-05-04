package com.pi.saudememora.model;

import jakarta.persistence.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController
@Entity
@Table(name = "tb_ficha_medica")
@CrossOrigin(origins = "*")
public class FichaMedica {

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ficha_medica")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_paciente", referencedColumnName = "id_paciente", nullable = false)
    private Paciente paciente;


    @Lob
    @Column(name = "ds_imagem")
    private byte[] imagem;

    @Column(name = "ds_ocr_texto", length = 2000)
    private String ocrTexto;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "dt_criacao")
    private Date dataCriacao;

    @Column(name = "tg_tratamento_medico")
    private boolean tratamentoMedico;

    public byte[] getImagem() {
        return imagem;
    }

    public void setImagem(byte[] imagem) {
        this.imagem = imagem;
    }

    public String getOcrTexto() {
        return ocrTexto;
    }

    public void setOcrTexto(String ocrTexto) {
        this.ocrTexto = ocrTexto;
    }

    public Date getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(Date dataCriacao) {
        this.dataCriacao = dataCriacao;
    }


    @Column(name = "tg_gravidez")
    private boolean gravidez;

    @Column(name = "tg_regime")
    private boolean regime;

    @Column(name = "tg_diabetes")
    private boolean diabetes;

    @Column(name = "tg_alergias")
    private boolean alergias;

    @Column(name = "tg_febre_reumatica")
    private boolean febreReumatica;

    @Column(name = "tg_coagulacao")
    private boolean coagulacao;

    @Column(name = "tg_doenca_cardio_vascular")
    private boolean doencaCardioVascular;

    @Column(name = "tg_hemorragicos")
    private boolean hemorragicos;

    @Column(name = "tg_problemas_anestesia")
    private boolean problemasAnestesia;

    @Column(name = "tg_alergia_medicamentos")
    private boolean alergiaMedicamentos;

    @Column(name = "tg_hepatite")
    private boolean hepatite;

    @Column(name = "tg_hiv")
    private boolean hiv;

    @Column(name = "tg_drogas")
    private boolean drogas;

    @Column(name = "tg_fumante")
    private boolean fumante;

    @Column(name = "tg_fumou")
    private boolean Fumou;

    @Column(name = "ds_pressao")
    private String pressao;

    @Column(name = "tg_respiratorios")
    private boolean Respiratorios;

    // Getters e setters
    public boolean isTratamentoMedico() {
        return tratamentoMedico;
    }

    public void setTratamentoMedico(boolean tratamentoMedico) {
        this.tratamentoMedico = tratamentoMedico;
    }

    public boolean isGravidez() {
        return gravidez;
    }

    public void setGravidez(boolean gravidez) {
        this.gravidez = gravidez;
    }

    public boolean isRegime() {
        return regime;
    }

    public void setRegime(boolean regime) {
        this.regime = regime;
    }

    public boolean isDiabetes() {
        return diabetes;
    }

    public void setDiabetes(boolean diabetes) {
        this.diabetes = diabetes;
    }

    public boolean isAlergias() {
        return alergias;
    }

    public void setAlergias(boolean alergias) {
        this.alergias = alergias;
    }

    public boolean isFebreReumatica() {
        return febreReumatica;
    }

    public void setFebreReumatica(boolean febreReumatica) {
        this.febreReumatica = febreReumatica;
    }

    public Long getPacienteId() {
        return paciente != null ? paciente.getId() : null;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    public boolean isCoagulacao() {
        return coagulacao;
    }

    public void setCoagulacao(boolean coagulacao) {
        this.coagulacao = coagulacao;
    }

    public boolean isDoencaCardioVascular() {
        return doencaCardioVascular;
    }

    public void setDoencaCardioVascular(boolean doencaCardioVascular) {
        this.doencaCardioVascular = doencaCardioVascular;
    }

    public boolean isHemorragicos() {
        return hemorragicos;
    }

    public void setHemorragicos(boolean hemorragicos) {
        this.hemorragicos = hemorragicos;
    }

    public boolean isProblemasAnestesia() {
        return problemasAnestesia;
    }

    public void setProblemasAnestesia(boolean problemasAnestesia) {
        this.problemasAnestesia = problemasAnestesia;
    }

    public boolean isAlergiaMedicamentos() {
        return alergiaMedicamentos;
    }

    public void setAlergiaMedicamentos(boolean alergiaMedicamentos) {
        this.alergiaMedicamentos = alergiaMedicamentos;
    }

    public boolean isHepatite() {
        return hepatite;
    }

    public void setHepatite(boolean hepatite) {
        this.hepatite = hepatite;
    }

    public boolean isHiv() {
        return hiv;
    }

    public void setHiv(boolean hiv) {
        this.hiv = hiv;
    }

    public boolean isDrogas() {
        return drogas;
    }

    public void setDrogas(boolean drogas) {
        this.drogas = drogas;
    }

    public boolean isFumante() {
        return fumante;
    }

    public void setFumante(boolean fumante) {
        this.fumante = fumante;
    }

    public boolean isFumou() {
        return Fumou;
    }

    public void setFumou(boolean Fumou) {
        this.Fumou = Fumou;
    }

    public String getPressao() {
        return pressao;
    }

    public void setPressao(String pressao) {
        this.pressao = pressao;
    }

    public boolean isRespiratorios() {
        return Respiratorios;
    }

    public void setRespiratorios(boolean problemasRespiratorios) {
        this.Respiratorios = problemasRespiratorios;
    }


    public Paciente getPaciente() {
        return paciente;
    }

}
