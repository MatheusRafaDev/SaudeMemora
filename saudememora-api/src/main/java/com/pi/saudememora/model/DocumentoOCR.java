package com.pi.saudememora.model;


import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "tb_documento_ocr")
public class DocumentoOCR {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_documento")
    private Long id;

    @Lob
    @Column(name = "ds_imagem")
    private byte[] imagem;

    @Column(name = "ds_ocr_texto", length = 2000)
    private String ocrTexto;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "dt_criacao")
    private Date dataCriacao;

    @Column(name = "tp_documento")
    private String tipoDocumento; // receita, exame, prontuario

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getTipoDocumento() {
        return tipoDocumento;
    }

    public void setTipoDocumento(String tipoDocumento) {
        this.tipoDocumento = tipoDocumento;
    }
}
