package com.pi.saudememora.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tb_medicamentos")
public class Medicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_medicamento")
    private Long id;

    @Column(name = "nm_medicamento", nullable = false)
    private String nome;

    @Column(name = "qt_medicamento", nullable = false)
    private String quantidade;

    @Column(name = "forma_uso", nullable = false)
    private String formaDeUso;

    @ManyToOne
    @JoinColumn(name = "id_receita", nullable = false) // Chave estrangeira para Receita
    private Receita receita;

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

    public String getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(String quantidade) {
        this.quantidade = quantidade;
    }

    public String getFormaDeUso() {
        return formaDeUso;
    }

    public void setFormaDeUso(String formaDeUso) {
        this.formaDeUso = formaDeUso;
    }


    public Receita getReceita() {
        return receita;
    }

    public void setReceita(Receita receita) {
        this.receita = receita;
    }
}