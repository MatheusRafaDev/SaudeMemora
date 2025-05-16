import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMaskInput } from 'react-imask';
import { atualizarPaciente } from '../services/pacienteService';
import 'bootstrap/dist/css/bootstrap.min.css';

function EditarPerfil() {
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [dadosForm, setDadosForm] = useState({
    id: '',
    nome: '',
    cpf: '',
    dataNascimento: '',
    sexo: '',
    email: '',
    telefone: '',
    endereco: '',
    senha: '',
    confirmarSenha: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    const storedPaciente = localStorage.getItem('paciente');

    if (storedPaciente) {
      const pacienteData = JSON.parse(storedPaciente);
      setPaciente(pacienteData);
      setDadosForm({
        ...pacienteData,
        senha: '',
        confirmarSenha: ''
      });
    } else {
      console.warn("Paciente não encontrado no localStorage.");
      navigate('/perfil');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDadosForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { nome, dataNascimento, sexo, senha, confirmarSenha } = dadosForm;

    if (!nome || !dataNascimento || !sexo) {
      setError('Nome, data de nascimento e sexo são obrigatórios!');
      return false;
    }

    if (senha && senha !== confirmarSenha) {
      setError('As senhas não coincidem!');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      atualizarPaciente( paciente.id ,dadosForm);
      console.log("Paciente atualizado com sucesso!");
      navigate('/perfil');
    } catch (error) {
      setError('Erro ao atualizar o paciente.');
    }
  };

  if (!paciente) {
    return null; // Aguarda o useEffect terminar de verificar o localStorage
  }

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h3 className="text-center mb-4">🔄 Alterar Cadastro de Paciente</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nome completo *</label>
              <input
                type="text"
                name="nome"
                value={dadosForm.nome}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">CPF *</label>
              <IMaskInput
                mask="000.000.000-00"
                name="cpf"
                value={dadosForm.cpf}
                className="form-control"
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Data de nascimento *</label>
              <IMaskInput
                mask="00/00/0000"
                name="dataNascimento"
                value={dadosForm.dataNascimento}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Sexo *</label>
              <select
                name="sexo"
                value={dadosForm.sexo}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Selecione</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Outro</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={dadosForm.email}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Telefone</label>
              <IMaskInput
                mask="(00) 00000-0000"
                name="telefone"
                value={dadosForm.telefone}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Endereço</label>
              <input
                type="text"
                name="endereco"
                value={dadosForm.endereco}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Senha (opcional)</label>
              <input
                type="password"
                name="senha"
                value={dadosForm.senha}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirmar Senha</label>
              <input
                type="password"
                name="confirmarSenha"
                value={dadosForm.confirmarSenha}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">Atualizar</button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/perfil')}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarPerfil;
