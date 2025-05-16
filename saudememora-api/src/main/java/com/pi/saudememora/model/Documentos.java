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

    @Column(name = "ds_tipo_documento", length = 1, nullable = false)
    private String tipoDocumento;


    @Column(name = "ds_status", length = 20, nullable = false)
    private String status;

    @Column(name = "ds_data_upload", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dataUpload;



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

    public String getTipoDocumento() {
        return tipoDocumento;
    }

    public void setTipoDocumento(String tipoDocumento) {
        this.tipoDocumento = tipoDocumento;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getDataUpload() {
        return dataUpload;
    }

    public void setDataUpload(Date dataUpload) {
        this.dataUpload = dataUpload;
    }
}
