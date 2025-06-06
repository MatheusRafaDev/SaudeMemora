package com.pi.saudememora.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.pi.saudememora.model.Documentos;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Date;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "tb_exame")
public class Exame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_exame")
    private Long id;


    @Column(name = "ds_tipo")
    private String tipo;

    @Column(name = "ds_laboratorio")
    private String laboratorio;

    @Column(name = "ds_resultado", length = 2000)
    private String resultado;

    @Column(name = "ds_observacoes", length = 2000)
    private String observacoes;

    @Column(name = "ds_imagem")
    private String imagem;

    @Lob
    @Column(name = "ds_resumo", columnDefinition = "TEXT")
    private String resumo;

    @Column(name = "nome_exame")
    private String nomeExame;

    @ManyToOne
    @JoinColumn(name = "id_documento", nullable = false)
    @JsonIgnoreProperties("exames")
    private Documentos documento;


    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Column(name = "dt_exame", nullable = false)
    private LocalDate dataExame;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Column(name = "dt_inclusao", nullable = false, updatable = false)
    private LocalDate dataInclusao;

    @PrePersist
    protected void onCreate() {
        this.dataInclusao = LocalDate.now();
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDataExame() {
        return dataExame;
    }
    public void setDataExame(LocalDate dataExame) {
        this.dataExame = dataExame;
    }


    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getLaboratorio() { return laboratorio; }
    public void setLaboratorio(String laboratorio) { this.laboratorio = laboratorio; }

    public String getResultado() { return resultado; }
    public void setResultado(String resultado) { this.resultado = resultado; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }

    public String getImagem() { return imagem; }
    public void setImagem(String imagem) { this.imagem = imagem; }

    public String getNomeExame() { return nomeExame; }
    public void setNomeExame(String nomeExame) { this.nomeExame = nomeExame; }

    public Documentos getDocumento() { return documento; }
    public void setDocumento(Documentos documento) { this.documento = documento; }

    public String getResumo() {
        return resumo;
    }
    public void setResumo(String resumo) {
        this.resumo = resumo;
    }
}
