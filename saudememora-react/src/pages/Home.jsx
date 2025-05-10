import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import Nav from '../components/Nav'; 


function Home() {
  const [nome, setNome] = useState('');
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
          <h1>Bem-vindo, {nome ? nome : 'Paciente'}!</h1>
          <p>Escolha uma das opções abaixo para navegar pela plataforma</p>
        </div>

        <div className="cards-grid">
          <div className="card" onClick={() => navigate('/perfil')}>
            <div className="card-icon">
              <img src="https://img.icons8.com/ios-filled/50/555555/user-male.png" alt="Meu Perfil" />
            </div>
            <span>Meu Perfil</span>
          </div>

          <div className="card" onClick={() => navigate('/meus-documentos')}>
            <div className="card-icon">
              <img src="https://img.icons8.com/ios-filled/50/555555/document.png" alt="Meus Documentos" />
            </div>
            <span>Meus Documentos</span>
          </div>

          <div className="card" onClick={() => navigate('/upload-documentos')}>
            <div className="card-icon">
              <img src="https://img.icons8.com/ios-filled/50/555555/camera.png" alt="Processar Texto" />
            </div>
            <span>Processar Documento</span> 
          </div>

          <div className="card" onClick={() => navigate('/relatorios')}>
            <div className="card-icon">
              <img src="https://img.icons8.com/ios-filled/50/555555/combo-chart.png" alt="Relatórios" />
            </div>
            <span>Relatórios</span>
          </div>
        </div>
      </main>

    </div>
  );
}

export default Home;
