package com.pi.saudememora.model;


import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "tb_documentos")
public class Documentos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_documentos")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_paciente", referencedColumnName = "id_paciente", nullable = false)
    private Paciente paciente;


    @Column(name = "ds_tipo_documento", length = 20, nullable = false)
    private String tipoDocumento;

    @Column(name = "ds_url_arquivo ", length = 2000)
    private String urlArquivo;

    @Column(name = "ds_status  ", length = 20, nullable = false)
    private String status;

    @Column(name = "ds_data_upload", nullable = false)  // Tipo String, você pode usar um tipo de dado de data se preferir
    private String dataUpload;

    public Long getId() {
        return id;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipoDocimento() {
        return tipoDocumento;
    }

    public void setTipoDocimento(String tipoDocimento) {
        this.tipoDocumento = tipoDocimento;
    }

    public String getUrlArquivo() {
        return urlArquivo;
    }

    public void setUrlArquivo(String urlArquivo) {
        this.urlArquivo = urlArquivo;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDataUpload() {
        return dataUpload;
    }

    public void setDataUpload(String dataUpload) {
        this.dataUpload = dataUpload;
    }
}
