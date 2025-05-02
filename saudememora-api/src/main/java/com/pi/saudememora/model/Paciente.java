package com.pi.saudememora.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "tb_paciente")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pk_id")  // Coluna id, tipo Long
    private Long id;

    @Column(name = "ds_nome", length = 100, nullable = false)  // Tipo String, com tamanho máximo de 100 caracteres
    private String nome;

    @Column(name = "ds_cpf", length = 14, nullable = false, unique = true)  // Tipo String, tamanho de 14 para CPF (mascara)
    private String cpf;

    @Column(name = "dt_nascimento", nullable = false)  // Tipo String, você pode usar um tipo de dado de data se preferir
    private String dataNascimento;

    @Column(name = "ds_sexo", length = 1, nullable = false)  // Tipo String, apenas um caractere (M/F)
    private String sexo;

    @Column(name = "ds_email", length = 100, nullable = false, unique = true)  // Tipo String, com tamanho de até 100 caracteres
    private String email;

    @Column(name = "ds_telefone", length = 15, nullable = true)  // Tipo String, tamanho de até 15 (com DDD)
    private String telefone;

    @Column(name = "ds_endereco", length = 255, nullable = true)  // Tipo String, até 255 caracteres
    private String endereco;

    @Column(name = "ds_senha", nullable = false)  // Tipo String, com tamanho de 255 para a senha criptografada
    private String senha;

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(String dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public String getSexo() {
        return sexo;
    }

    public void setSexo(String sexo) {
        this.sexo = sexo;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}
