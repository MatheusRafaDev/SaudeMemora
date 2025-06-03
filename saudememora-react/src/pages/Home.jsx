import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import Nav from "../components/Nav";

function Home() {
  const [nome, setNome] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const paciente = JSON.parse(localStorage.getItem("paciente"));
    if (paciente && paciente.nome) {
      setNome(paciente.nome);
    }
  }, []);

  return (
    <div className="home-container">
      <Nav />

      <main className="main-content">
        <div className="home-header">
          <h1>Bem-vindo, {nome ? nome : "Paciente"}!</h1>
          <p>Escolha uma das opções abaixo para navegar pela plataforma</p>
        </div>

        <div className="app-description">
          <h2>O que é o Saúde Memora?</h2>
          <div className="description-content">
            <div className="description-text">
              <p>
                O <strong>Saúde Memora</strong> é sua plataforma digital para gerenciamento completo de documentos médicos. 
                Com tecnologia de OCR e IA, transformamos seus documentos físicos em registros digitais organizados e acessíveis.
              </p>
            </div>
          </div>
        </div>

        <div className="cards-grid">
          <div className="card" onClick={() => navigate("/perfil")}>
            <div className="card-icon">
              <img
                src="https://img.icons8.com/ios-filled/50/555555/user-male.png"
                alt="Meu Perfil"
              />
            </div>
            <span>Meu Perfil</span>
            <p className="card-description">Acesse e atualize seus dados pessoais</p>
          </div>

          <div className="card" onClick={() => navigate("/visualizar-ficha")}>
            <div className="card-icon">
              <i
                className="bi bi-file-text"
                style={{ fontSize: "1.8rem", color: "#555555" }}
              ></i>
            </div>
            <span>Ficha Médica</span>
            <p className="card-description">Consulte seu histórico de saúde e alergias</p>
          </div>

          <div className="card" onClick={() => navigate("/meus-documentos")}>
            <div className="card-icon">
              <img
                src="https://img.icons8.com/ios-filled/50/555555/document.png"
                alt="Meus Documentos"
              />
            </div>
            <span>Meus Documentos</span>
            <p className="card-description">Exames, receitas e documentos clínicos</p>
          </div>

          <div className="card" onClick={() => navigate("/upload-documentos")}>
            <div className="card-icon">
              <img
                src="https://img.icons8.com/ios-filled/50/555555/camera.png"
                alt="Processar Texto"
              />
            </div>
            <span>Processar Documento</span>
            <p className="card-description">Digitalize e organize novos documentos</p>
          </div>

          <div className="card" onClick={() => navigate("/relatorios")}>
            <div className="card-icon">
              <img
                src="https://img.icons8.com/ios-filled/50/555555/combo-chart.png"
                alt="Relatórios"
              />
            </div>
            <span>Relatórios</span>
            <p className="card-description">Visualize análises do seu histórico</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;