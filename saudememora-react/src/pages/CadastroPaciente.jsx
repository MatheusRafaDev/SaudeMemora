import React, { useState } from 'react';
import axios from 'axios';
import '../styles/CadastroPaciente.css';

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

  // Função para atualizar os valores do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Função para validar os campos do formulário
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


  axios.defaults.baseURL = 'http://localhost:7070'; 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    try {
      const response = await axios.post('/api/paciente/cadastrar', formData);
      if (response.status === 200) {
        alert('Paciente cadastrado com sucesso!');
      }
    } catch (error) {
      setError('Erro ao cadastrar paciente!');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2>Cadastro de Paciente</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        
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
        <input 
          type="text" 
          name="cpf" 
          value={formData.cpf} 
          onChange={handleChange} 
          placeholder="Somente números (11 dígitos)" 
          pattern="\d{11}" 
          maxLength="11" 
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
        <input 
          type="tel" 
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
