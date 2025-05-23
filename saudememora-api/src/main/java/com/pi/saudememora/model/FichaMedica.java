package com.pi.saudememora.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Date;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "tb_ficha_medica")
public class FichaMedica {

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
    private Boolean tratamentoMedico;
    @Column(name = "ds_tratamento_medico", length = 255)
    private String tratamentoMedicoExtra;

    @Column(name = "tg_gravidez")
    private Boolean gravidez;
    @Column(name = "ds_gravidez", length = 50)
    private String gravidezExtra;

    @Column(name = "tg_regime")
    private Boolean regime;
    @Column(name = "ds_regime", length = 255)
    private String regimeExtra;

    @Column(name = "tg_diabetes")
    private Boolean diabetes;
    @Column(name = "ds_diabetes", length = 50)
    private String diabetesExtra;

    @Column(name = "tg_alergias")
    private Boolean alergias;
    @Column(name = "ds_alergias", length = 255)
    private String alergiasExtra;

    @Column(name = "tg_reumatica")
    private Boolean reumatica;

    @Column(name = "tg_coagulacao")
    private Boolean coagulacao;

    @Column(name = "tg_doenca_cardio_vascular")
    private Boolean doencaCardioVascular;
    @Column(name = "ds_doenca_cardio_vascular", length = 255)
    private String doencaCardioVascularExtra;

    @Column(name = "tg_hemorragicos")
    private Boolean hemorragicos;

    @Column(name = "tg_problemas_anestesia")
    private Boolean problemasAnestesia;
    @Column(name = "ds_problemas_anestesia", length = 255)
    private String problemasAnestesiaExtra;

    @Column(name = "tg_alergia_medicamentos")
    private Boolean alergiaMedicamentos;
    @Column(name = "ds_alergia_medicamentos", length = 255)
    private String alergiaMedicamentosExtra;

    @Column(name = "tg_hepatite")
    private Boolean hepatite;
    @Column(name = "ds_hepatite", length = 50)
    private String hepatiteExtra;

    @Column(name = "tg_hiv")
    private Boolean hiv;

    @Column(name = "tg_drogas")
    private Boolean drogas;

    @Column(name = "tg_fumante")
    private Boolean fumante;

    @Column(name = "tg_fumou")
    private Boolean fumou;

    @Column(name = "ds_pressao", length = 20)
    private String pressao;

    @Column(name = "tg_respiratorios")
    private Boolean respiratorio;
    @Column(name = "ds_respiratorios", length = 255)
    private String respiratorioExtra;

    @Column(name = "tg_doenca_familia")
    private Boolean doencaFamilia;
    @Column(name = "ds_doenca_familia", length = 255)
    private String doencaFamiliaExtra;

    // Getters e Setters para campos não booleanos
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

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

    // Métodos booleanos com prefixo 'is'
    public boolean isTratamentoMedico() {
        return tratamentoMedico != null && tratamentoMedico;
    }

    public void setTratamentoMedico(Boolean tratamentoMedico) {
        this.tratamentoMedico = tratamentoMedico;
    }

    public String getTratamentoMedicoExtra() {
        return tratamentoMedicoExtra;
    }

    public void setTratamentoMedicoExtra(String tratamentoMedicoExtra) {
        this.tratamentoMedicoExtra = tratamentoMedicoExtra;
    }

    public boolean isGravidez() {
        return gravidez != null && gravidez;
    }

    public void setGravidez(Boolean gravidez) {
        this.gravidez = gravidez;
    }

    public String getGravidezExtra() {
        return gravidezExtra;
    }

    public void setGravidezExtra(String gravidezExtra) {
        this.gravidezExtra = gravidezExtra;
    }

    public boolean isRegime() {
        return regime != null && regime;
    }

    public void setRegime(Boolean regime) {
        this.regime = regime;
    }

    public String getRegimeExtra() {
        return regimeExtra;
    }

    public void setRegimeExtra(String regimeExtra) {
        this.regimeExtra = regimeExtra;
    }

    public boolean isDiabetes() {
        return diabetes != null && diabetes;
    }

    public void setDiabetes(Boolean diabetes) {
        this.diabetes = diabetes;
    }

    public String getDiabetesExtra() {
        return diabetesExtra;
    }

    public void setDiabetesExtra(String diabetesExtra) {
        this.diabetesExtra = diabetesExtra;
    }

    public boolean isAlergias() {
        return alergias != null && alergias;
    }

    public void setAlergias(Boolean alergias) {
        this.alergias = alergias;
    }

    public String getAlergiasExtra() {
        return alergiasExtra;
    }

    public void setAlergiasExtra(String alergiasExtra) {
        this.alergiasExtra = alergiasExtra;
    }

    public boolean isReumatica() {
        return reumatica != null && reumatica;
    }

    public void setReumatica(Boolean reumatica) {
        this.reumatica = reumatica;
    }

    public boolean isCoagulacao() {
        return coagulacao != null && coagulacao;
    }

    public void setCoagulacao(Boolean coagulacao) {
        this.coagulacao = coagulacao;
    }

    public boolean isDoencaCardioVascular() {
        return doencaCardioVascular != null && doencaCardioVascular;
    }

    public void setDoencaCardioVascular(Boolean doencaCardioVascular) {
        this.doencaCardioVascular = doencaCardioVascular;
    }

    public String getDoencaCardioVascularExtra() {
        return doencaCardioVascularExtra;
    }

    public void setDoencaCardioVascularExtra(String doencaCardioVascularExtra) {
        this.doencaCardioVascularExtra = doencaCardioVascularExtra;
    }

    public boolean isHemorragicos() {
        return hemorragicos != null && hemorragicos;
    }

    public void setHemorragicos(Boolean hemorragicos) {
        this.hemorragicos = hemorragicos;
    }

    public boolean isProblemasAnestesia() {
        return problemasAnestesia != null && problemasAnestesia;
    }

    public void setProblemasAnestesia(Boolean problemasAnestesia) {
        this.problemasAnestesia = problemasAnestesia;
    }

    public String getProblemasAnestesiaExtra() {
        return problemasAnestesiaExtra;
    }

    public void setProblemasAnestesiaExtra(String problemasAnestesiaExtra) {
        this.problemasAnestesiaExtra = problemasAnestesiaExtra;
    }

    public boolean isAlergiaMedicamentos() {
        return alergiaMedicamentos != null && alergiaMedicamentos;
    }

    public void setAlergiaMedicamentos(Boolean alergiaMedicamentos) {
        this.alergiaMedicamentos = alergiaMedicamentos;
    }

    public String getAlergiaMedicamentosExtra() {
        return alergiaMedicamentosExtra;
    }

    public void setAlergiaMedicamentosExtra(String alergiaMedicamentosExtra) {
        this.alergiaMedicamentosExtra = alergiaMedicamentosExtra;
    }

    public boolean isHepatite() {
        return hepatite != null && hepatite;
    }

    public void setHepatite(Boolean hepatite) {
        this.hepatite = hepatite;
    }

    public String getHepatiteExtra() {
        return hepatiteExtra;
    }

    public void setHepatiteExtra(String hepatiteExtra) {
        this.hepatiteExtra = hepatiteExtra;
    }

    public boolean isHiv() {
        return hiv != null && hiv;
    }

    public void setHiv(Boolean hiv) {
        this.hiv = hiv;
    }

    public boolean isDrogas() {
        return drogas != null && drogas;
    }

    public void setDrogas(Boolean drogas) {
        this.drogas = drogas;
    }

    public boolean isFumante() {
        return fumante != null && fumante;
    }

    public void setFumante(Boolean fumante) {
        this.fumante = fumante;
    }

    public boolean isFumou() {
        return fumou != null && fumou;
    }

    public void setFumou(Boolean fumou) {
        this.fumou = fumou;
    }

    public String getPressao() {
        return pressao;
    }

    public void setPressao(String pressao) {
        this.pressao = pressao;
    }

    public boolean isRespiratorio() {
        return respiratorio != null && respiratorio;
    }

    public void setRespiratorio(Boolean respiratorio) {
        this.respiratorio = respiratorio;
    }

    public String getRespiratorioExtra() {
        return respiratorioExtra;
    }

    public void setRespiratorioExtra(String respiratorioExtra) {
        this.respiratorioExtra = respiratorioExtra;
    }

    public boolean isDoencaFamilia() {
        return doencaFamilia != null && doencaFamilia;
    }

    public void setDoencaFamilia(Boolean doencaFamilia) {
        this.doencaFamilia = doencaFamilia;
    }

    public String getDoencaFamiliaExtra() {
        return doencaFamiliaExtra;
    }

    public void setDoencaFamiliaExtra(String doencaFamiliaExtra) {
        this.doencaFamiliaExtra = doencaFamiliaExtra;
    }
}