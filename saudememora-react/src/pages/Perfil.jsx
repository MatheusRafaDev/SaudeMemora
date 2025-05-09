import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Perfil.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

function Perfil() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const paciente = JSON.parse(localStorage.getItem("paciente")) || {};

  useEffect(() => {
    if (paciente) {
      setNome(paciente.nome);
      setEmail(paciente.email);
    }
  }, []);

  const handleEditar = (id) => {
    sessionStorage.setItem("pacienteId", id); // Armazena o ID no sessionStorage
    navigate("/editar-perfil"); // Navega para a página de edição
  };

  return (
    <div className="profile-container">
      <Nav />
      <main className="profile-main">
        <div className="profile-header">
          <h1>Perfil de {nome}</h1>
        </div>

        <div className="profile-details">
          <p>
            <strong>Nome:</strong> {nome}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
        </div>
        <div className="profile-actions">
          <button
            className="profile-button"
            onClick={() => handleEditar(paciente.id)}
          >
            Editar Perfil
          </button>
        </div>
        <br />
        <div className="profile-actions">
          <button
            className="profile-button"
            onClick={() => navigate("/formulario-medico")}
          >
            Ir para o Formulário Médico
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Perfil;
