import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

function AlterarPaciente() {
  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h3 className="text-center mb-4">🔄 Alterar Cadastro de Paciente</h3>
          <form>
            <div className="mb-3">
              <label htmlFor="nome" className="form-label">Nome completo *</label>
              <input type="text" className="form-control" id="nome" defaultValue="João da Silva" required />
            </div>

            <div className="mb-3">
              <label htmlFor="cpf" className="form-label">CPF *</label>
              <input type="text" className="form-control" id="cpf" defaultValue="12345678900" disabled />
            </div>

            <div className="mb-3">
              <label htmlFor="dataNascimento" className="form-label">Data de nascimento *</label>
              <input type="date" className="form-control" id="dataNascimento" defaultValue="1990-01-01" required />
            </div>

            <div className="mb-3">
              <label htmlFor="sexo" className="form-label">Sexo *</label>
              <select className="form-select" id="sexo" required defaultValue="masculino">
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className="form-control" id="email" defaultValue="joao@email.com" />
            </div>

            <div className="mb-3">
              <label htmlFor="telefone" className="form-label">Telefone</label>
              <input type="tel" className="form-control" id="telefone" defaultValue="(11) 98765-4321" />
            </div>

            <div className="mb-3">
              <label htmlFor="endereco" className="form-label">Endereço</label>
              <input type="text" className="form-control" id="endereco" defaultValue="Rua das Flores, 123, Centro" />
            </div>

            <div className="mb-3">
              <label htmlFor="senha" className="form-label">Senha (opcional)</label>
              <input type="password" className="form-control" id="senha" placeholder="Digite nova senha" />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmarSenha" className="form-label">Confirmar Senha</label>
              <input type="password" className="form-control" id="confirmarSenha" placeholder="Repita a senha" />
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">Atualizar</button>
              <button type="button" className="btn btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AlterarPaciente;