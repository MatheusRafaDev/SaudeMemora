import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaFileMedical,
  FaUser,
  FaFileAlt,
  FaUpload,
  FaChartLine,
} from "react-icons/fa";

function Home() {
  const [nome, setNome] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const paciente = JSON.parse(localStorage.getItem("paciente"));

    if (paciente && paciente.nome) {
      setNome(paciente.nome);
    }
  }, []);

  const cards = [
    {
      title: "Meu Perfil",
      description: "Acesse e atualize seus dados pessoais",
      icon: <FaUser size={30} color="#555555" />,
      action: () => navigate("/perfil"),
    },
    {
      title: "Ficha Médica",
      description: "Consulte seu histórico de saúde e alergias",
      icon: <FaFileAlt size={30} color="#555555" />,
      action: () => navigate("/visualizar-ficha"),
    },
    {
      title: "Meus Documentos",
      description: "Exames, receitas e documentos clínicos",
      icon: <FaFileMedical size={30} color="#555555" />,
      action: () => navigate("/meus-documentos"),
    },
    {
      title: "Processar Documento",
      description: "Digitalize e organize novos documentos",
      icon: <FaUpload size={30} color="#555555" />,
      action: () => navigate("/upload-documentos"),
    },
    {
      title: "Relatórios",
      description: "Visualize análises do seu histórico",
      icon: <FaChartLine size={30} color="#555555" />,
      action: () => navigate("/relatorios"),
    },
  ];

  return (
    <div className="home-container">

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
                O <strong>Saúde Memora</strong> é sua plataforma digital para
                gerenciamento completo de documentos médicos. Com tecnologia de
                OCR e IA, transformamos seus documentos físicos em registros
                digitais organizados e acessíveis.
              </p>
            </div>
          </div>
        </div>

        <div className="cards-grid">
          {cards.map((card, index) => (
            <div key={index} className="card" onClick={card.action}>
              <div className="card-icon">{card.icon}</div>
              <span>{card.title}</span>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </main>

      <style jsx>{`
        .home-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #f4f7fa;
        }

        .main-content {
          flex: 1;
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .home-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .home-header h1 {
          font-size: 2rem;
          color: #2a7fba;
          margin-bottom: 10px;
        }

        .home-header p {
          font-size: 1rem;
          color: #6c6c6c;
          max-width: 600px;
          margin: 0 auto;
        }

        .app-description {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 30px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .app-description h2 {
          color: #2a7fba;
          margin-top: 0;
          margin-bottom: 15px;
          text-align: center;
          font-size: 1.5rem;
        }

        .description-content {
          display: flex;
          gap: 30px;
          align-items: center;
        }

        .description-text {
          flex: 1;
        }

        .description-text p {
          line-height: 1.6;
          color: #555;
          margin-bottom: 15px;
        }

        .description-text ul {
          padding-left: 20px;
          color: #555;
          list-style-type: none;
        }

        .description-text li {
          margin-bottom: 10px;
          line-height: 1.5;
          position: relative;
          padding-left: 25px;
        }

        .description-text li:before {
          content: "•";
          color: #2a7fba;
          font-size: 1.5rem;
          position: absolute;
          left: 0;
          top: -3px;
        }

        .description-image {
          flex: 0 0 200px;
          text-align: center;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }

        .card {
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          padding: 25px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .card-icon {
          width: 60px;
          height: 60px;
          background-color: #e1f0fa;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
        }

        .card span {
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .card p {
          font-size: 0.85rem;
          color: #666;
          margin: 0;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .description-content {
            flex-direction: column;
          }

          .description-image {
            margin-top: 20px;
            order: -1;
          }

          .home-header h1 {
            font-size: 1.8rem;
          }
        }

        @media (max-width: 480px) {
          .cards-grid {
            grid-template-columns: 1fr;
          }

          .main-content {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
