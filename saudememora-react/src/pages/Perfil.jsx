import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaUserAlt, FaEnvelope, FaPhoneAlt, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Nav from '../components/Nav';

import '../styles/Perfil.css';

const Perfil = () => {
  const [paciente, setPaciente] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPaciente = localStorage.getItem('paciente');
    setPaciente(storedPaciente ? JSON.parse(storedPaciente) : null);
  }, []);

  const handleNavigate = (path) => navigate(path);

  const renderInfo = (icon, label, value) => (
    <div className="profile-info">
      <div className="profile-icon">{icon}</div>
      <div className="profile-text">
        <strong>{label}:</strong> {value || 'N/A'}
      </div>
    </div>
  );

  if (!paciente) {
    return (
      <div>
        <Nav />
        <div className="profile-container">
          <h2 className="profile-header">Perfil</h2>
          <p className="profile-message">Nenhum dado encontrado. Por favor, cadastre ou atualize suas informações.</p>
          <button
            className="btn profile-button"
            onClick={() => handleNavigate('/alterar-perfil')}
          >
            <FaEdit /> Cadastrar Perfil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className="profile-container">
        <h2 className="profile-header">Perfil do Paciente</h2>

        <div className="profile-card">
          <div className="profile-details">
            {renderInfo(<FaUserAlt />, 'Nome', paciente.nome)}
            {renderInfo(<FaEnvelope />, 'Email', paciente.email)}
            {renderInfo(<FaPhoneAlt />, 'Telefone', paciente.telefone)}
            {renderInfo(<FaCalendarAlt />, 'Data de Nascimento', paciente.dataNascimento)}
            {renderInfo(<FaMapMarkerAlt />, 'Endereço', paciente.endereco)}
            {renderInfo(null, 'CPF', paciente.cpf)}
            {renderInfo(null, 'Sexo', paciente.sexo === 'M' ? 'Masculino' : paciente.sexo === 'F' ? 'Feminino' : 'Outro')}
          </div>

          <div className="profile-actions">
            <button
              className="btn profile-button"
              onClick={() => handleNavigate('/alterar-perfil')}
            >
              <FaEdit /> Alterar Perfil
            </button>
            <button
              className="btn profile-button"
              onClick={() => handleNavigate('/formulario-medico')}
            >
              Formulário Médico
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;