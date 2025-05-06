import React, { useState} from 'react';
import { IMaskInput } from 'react-imask';
import { cadastrarPaciente } from '../services/pacienteService';
import { useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

const CadastroPaciente = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    sexo: '',
    email: '',
    telefone: '',
    endereco: '',
    senha: '',
    confirmarSenha: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const { nome, cpf, dataNascimento, sexo, senha, confirmarSenha } = formData;
    if (!nome || !cpf || !dataNascimento || !sexo || !senha || !confirmarSenha) {
      setError('Todos os campos são obrigatórios!');
      return false;
    }

    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem!');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const isValid = validateForm();
    if (!isValid) return;
  
    const result = await cadastrarPaciente(formData);
  
    if (result.success) {
      localStorage.setItem('paciente', JSON.stringify(result.dados));

      
      navigate('/formulario-medico');
    } else {
      setError(result.message || 'Erro desconhecido');
    }
  };
  
  
  return (
    <div className="container mt-5">
      <div className="saude-card shadow-sm p-4 rounded bg-white">
        <div className="card-body">
          <h2 className="text-center mb-4">Cadastro de Paciente</h2>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {typeof error === 'object' ? error.message : error}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">
                Nome completo <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="form-control"
                placeholder="Digite o nome completo"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                CPF <span className="text-danger">*</span>
              </label>
              <IMaskInput
                mask="000.000.000-00"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                className="form-control"
                placeholder="Somente números (11 dígitos)"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Data de nascimento <span className="text-danger">*</span>
              </label>
              <IMaskInput
                mask="00/00/0000"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleChange}
                className="form-control"
                placeholder="DD/MM/AAAA"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Sexo <span className="text-danger">*</span>
              </label>
              <select
                name="sexo"
                value={formData.sexo}
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
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="exemplo@email.com"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Telefone</label>
              <IMaskInput
                mask="(00) 00000-0000"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="form-control"
                placeholder="(99) 99999-9999"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Endereço</label>
              <input
                type="text"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                className="form-control"
                placeholder="Rua, número, bairro..."
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Senha <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                className="form-control"
                placeholder="Digite uma senha"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Confirmar Senha <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                className="form-control"
                placeholder="Repita a senha"
                required
              />
            </div>

            <div className="text-end mt-4">
              <button 
                type="submit" 
                className="btn btn-outline-primary px-4"
              >
                Próximo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroPaciente;
