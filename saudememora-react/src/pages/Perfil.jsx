import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactModal from "react-modal";
import {
  FaEdit,
  FaUserAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaTrash,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTimes,
  FaCheck,
} from "react-icons/fa";

import {deletarPaciente} from "../services/pacienteService"; // Supondo que você tenha esse serviço
import "../styles/Perfil.css";

// Configuração do modal para acessibilidade
ReactModal.setAppElement("#root");

const Perfil = () => {
  const [paciente, setPaciente] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPaciente = localStorage.getItem("paciente");
    setPaciente(storedPaciente ? JSON.parse(storedPaciente) : null);
  }, []);

  const handleNavigate = (path) => navigate(path);

  const handleDeleteProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {

      await deletarPaciente(paciente.id); 

      localStorage.removeItem("paciente");

 
      navigate("/login");
    } catch (err) {
      setError("Erro ao deletar perfil. Por favor, tente novamente.");
      console.error("Erro ao deletar perfil:", err);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const ConfirmationModal = () => {
    return (
      <ReactModal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Confirmação de exclusão"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="modal-inner">
          <div className="modal-header">
            <h3 className="modal-title">Confirmar ação</h3>
            <button
              onClick={() => setShowModal(false)}
              className="modal-close-btn"
              disabled={loading}
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="modal-body">
            <p>Tem certeza que deseja deletar seu perfil permanentemente?</p>
            <p className="text-red-500">Esta ação não pode ser desfeita.</p>
            
            {error && <p className="text-red-500">{error}</p>}
          </div>
          
          <div className="modal-footer">
            <button
              onClick={() => setShowModal(false)}
              className="btn btn-cancel"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteProfile}
              className="btn btn-confirm"
              disabled={loading}
            >
              {loading ? (
                "Deletando..."
              ) : (
                <>
                  <FaCheck /> Confirmar
                </>
              )}
            </button>
          </div>
        </div>
      </ReactModal>
    );
  };

  const renderInfo = (icon, label, value) => (
    <div className="profile-info">
      <div className="profile-icon">{icon}</div>
      <div className="profile-text">
        <strong>{label}:</strong> {value || "N/A"}
      </div>
    </div>
  );

  if (!paciente) {
    return (
      <div>

        <div className="profile-container">
          <h2 className="profile-header">Perfil</h2>
          <p className="profile-message">
            Nenhum dado encontrado. Por favor, cadastre ou atualize suas
            informações.
          </p>
          <button
            className="btn profile-button"
            onClick={() => handleNavigate("/alterar-perfil")}
          >
            <FaEdit /> Cadastrar Perfil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>

      <div className="profile-container">
        <h2 className="profile-header">Perfil do Paciente</h2>

        <div className="profile-card">
          <div className="profile-details">
            {renderInfo(<FaUserAlt />, "Nome", paciente.nome)}
            {renderInfo(<FaEnvelope />, "Email", paciente.email)}
            {renderInfo(<FaPhoneAlt />, "Telefone", paciente.telefone)}
            {renderInfo(
              <FaCalendarAlt />,
              "Data de Nascimento",
              paciente.dataNascimento
            )}
            {renderInfo(<FaMapMarkerAlt />, "Endereço", paciente.endereco)}
            {renderInfo(null, "CPF", paciente.cpf)}
            {renderInfo(
              null,
              "Sexo",
              paciente.sexo === "M"
                ? "Masculino"
                : paciente.sexo === "F"
                ? "Feminino"
                : "Outro"
            )}
          </div>

          <div className="profile-actions">
            <button
              className="btn profile-button"
              onClick={() => handleNavigate("/alterar-perfil")}
            >
              <FaEdit /> Alterar Perfil
            </button>
            <button
              className="btn profile-button"
              onClick={() => handleNavigate("/formulario-medico")}
            >
              Formulário Médico
            </button>

            <button
              className="btn btn-danger profile-button"
              onClick={() => setShowModal(true)}
            >
              <FaTrash /> Deletar Perfil
            </button>

            <button
              className="btn btn-danger profile-button"
              onClick={() => {
                localStorage.removeItem("paciente");
                navigate("/login"); 
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </div>
      
      <ConfirmationModal />
    </div>
  );
};

export default Perfil;