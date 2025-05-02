import React, { useState } from 'react';
import { IMaskInput } from 'react-imask';
import '../styles/CadastroPaciente.css';
import { cadastrarPaciente, listarPacientes } from '../services/pacienteService'; // Importe as funções

const CadastroPaciente = () => {
  const [formData, setFormData] = useState({
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
  const [pacientes, setPacientes] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
  
    if (!formData.nome || !formData.cpf || !formData.email) {
      setError('Todos os campos são obrigatórios!');
      return;
    }
  
    const result = await cadastrarPaciente(formData);
  
    if (result.success) {
      // Lógica de sucesso, por exemplo, redirecionar ou limpar o formulário
    } else {
      // Supondo que `result.message` seja uma string com o erro
      setError(result.message || 'Erro desconhecido');
    }
  };
  


  return (
    <div className="container">
      <h2>Cadastro de Paciente</h2>
      <form onSubmit={handleSubmit}>
      {error && <div className="error">{typeof error === 'object' ? error.message : error}</div>}

        
        <label>Nome completo <span className="required">*</span></label>
        <input 
          type="text" 
          name="nome" 
          value={formData.nome} 
          onChange={handleChange} 
          placeholder="Digite o nome completo" 
          required 
        />

        <label>CPF <span className="required">*</span></label>
        <IMaskInput 
          mask="000.000.000-00"
          name="cpf"
          value={formData.cpf}
          onChange={handleChange}
          placeholder="Somente números (11 dígitos)"
          required
        />

        <label>Data de nascimento <span className="required">*</span></label>
        <input 
          type="date" 
          name="dataNascimento" 
          value={formData.dataNascimento} 
          onChange={handleChange} 
          required 
        />

        <label>Sexo <span className="required">*</span></label>
        <select
          name="sexo"
          value={formData.sexo}
          onChange={handleChange}
          required
        >
          <option value="">Selecione</option>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
          <option value="O">Outro</option>
        </select>

        <label>Email</label>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          placeholder="exemplo@email.com" 
        />

        <label>Telefone</label>
        <IMaskInput 
          mask="(00) 00000-0000"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          placeholder="(99) 99999-9999"
        />

        <label>Endereço</label>
        <input 
          type="text" 
          name="endereco" 
          value={formData.endereco} 
          onChange={handleChange} 
          placeholder="Rua, número, bairro..." 
        />

        <label>Senha <span className="required">*</span></label>
        <input 
          type="password" 
          name="senha" 
          value={formData.senha} 
          onChange={handleChange} 
          placeholder="Digite uma senha" 
          required 
        />

        <label>Confirmar Senha <span className="required">*</span></label>
        <input 
          type="password" 
          name="confirmarSenha" 
          value={formData.confirmarSenha} 
          onChange={handleChange} 
          placeholder="Repita a senha" 
          required 
        />

        <button type="submit" className="btn">Cadastrar</button>
      </form>

      
    </div>
  );
};

export default CadastroPaciente;
