import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obterPaciente, atualizarPaciente } from '../services/pacienteService';
import { IMaskInput } from 'react-imask';
import 'bootstrap/dist/css/bootstrap.min.css';

function EditarPerfil() {
  const navigate = useNavigate();
  const pacienteId = sessionStorage.getItem('pacienteId');

  if (!pacienteId) {
    console.warn("ID do paciente não encontrado no sessionStorage.");
  }

  const [dadosForm, setDadosForm] = useState({
    id: pacienteId || '',
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
    const carregarPaciente = async () => {
      if (!pacienteId) {
        setError('Paciente não encontrado.');
        return;
      }

      try {
        const response = await obterPaciente(pacienteId);

        if (response.success) {
          setDadosForm(response.data);
        } else {
          setError(response.message || 'Erro ao carregar os dados do paciente.');
        }
      } catch (error) {
        setError('Erro ao carregar os dados do paciente.');
      }
    };

    carregarPaciente();
  }, [pacienteId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDadosForm({
      ...dadosForm,
      [name]: value,
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await atualizarPaciente(pacienteId, dadosForm);

      if (response.success) {
        navigate('/lista-pacientes');
      } else {
        setError(response.message || 'Erro ao atualizar o paciente.');
      }
    } catch (error) {
      setError('Erro ao atualizar o paciente.');
    }
  };

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
