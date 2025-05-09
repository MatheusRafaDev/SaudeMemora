import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaUserAlt, FaEnvelope, FaPhoneAlt, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Nav from '../components/Nav'; 
import Footer from '../components/Footer'; 
import '../styles/Perfil.css'; 

const Perfil = () => {
  const [paciente, setPaciente] = useState({});
  const navigate = useNavigate();

  useEffect(() => {

    const pacienteData = JSON.parse(localStorage.getItem("paciente")) || {};
    setPaciente(pacienteData);
  }, []);

  return (
    <div> 
      <Nav />

      <div className="profile-container">
        <main className="profile-main">
          <div className="profile-header text-center">
            <h1>Perfil de {paciente.nome ? paciente.nome : 'Paciente'}</h1>
          </div>

          <div className="profile-details card">
            <div className="profile-info">
              <FaUserAlt className="icon" />
              <p><strong>Nome:</strong> {paciente.nome}</p>
            </div>
            <div className="profile-info">
              <FaEnvelope className="icon" />
              <p><strong>Email:</strong> {paciente.email}</p>
            </div>
            <div className="profile-info">
              <FaPhoneAlt className="icon" />
              <p><strong>Telefone:</strong> {paciente.telefone}</p>
            </div>
            <div className="profile-info">
              <FaCalendarAlt className="icon" />
              <p><strong>Data de Nascimento:</strong> {paciente.dataNascimento}</p>
            </div>
            <div className="profile-info">
              <FaMapMarkerAlt className="icon" />
              <p><strong>Endereço:</strong> {paciente.endereco}</p>
            </div>
            <div className="profile-info">
              <p><strong>CPF:</strong> {paciente.cpf}</p>
            </div>
            <div className="profile-info">
              <p><strong>Sexo:</strong> {paciente.sexo === 'M' ? 'Masculino' : paciente.sexo === 'F' ? 'Feminino' : 'Outro'}</p>
            </div>
          </div>

          <div className="profile-actions">
            <button 
              className="btn btn-outline-primary profile-button"
              onClick={() => navigate('/alterar-perfil')}
            >
              <FaEdit className="me-2" /> Alterar Perfil
            </button>

            <button 
              className="btn btn-outline-secondary mt-3 profile-button"
              onClick={() => navigate('/formulario-medico')}
            >
              Ir para o Formulário Médico
            </button>
          </div>
        </main>

      </div>
    </div>
  );
}

export default Perfil;
