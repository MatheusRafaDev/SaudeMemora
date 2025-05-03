import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

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
      <header className="header">
        <h1 className="title">SaúdeMemora</h1>
    
      </header>

      <main className="main-content">
        <div className="cards-grid">
          <div className="card">
            <img src="https://img.icons8.com/ios-filled/50/555555/user-male.png" alt="Meu Perfil" />
            <span>{nome ? nome : 'Meu Perfil'}</span>
          </div>
          <div className="card" onClick={() => navigate('/meus-documentos')}>
            <img src="https://img.icons8.com/ios-filled/50/555555/document.png" alt="Meus Documentos" />
            <span>Meus Documentos</span>
          </div>
          <div className="card" onClick={() => navigate('/ocr')}>
            <img src="https://img.icons8.com/ios-filled/50/555555/camera.png" alt="OCR" />
            <span>OCR</span>
          </div>
          <div className="card" onClick={() => navigate('/relatorios')}>
            <img src="https://img.icons8.com/ios-filled/50/555555/combo-chart.png" alt="Relatórios" />
            <span>Relatórios</span>
          </div>
        </div>
      </main>

      <footer className="footer">
        <button className="footer-button" onClick={() => navigate('/home')}>
          <img src="https://img.icons8.com/ios-filled/24/ffffff/home.png" alt="Home" />
          <span>Home</span>
        </button>
        <button className="footer-button" onClick={() => navigate('/perfil')}>
          <img src="https://img.icons8.com/ios-filled/24/ffffff/user-male.png" alt="Perfil" />
          <span>Perfil</span>
        </button>
        <button className="footer-button" onClick={() => navigate('/documentos')}>
          <img src="https://img.icons8.com/ios-filled/24/ffffff/document.png" alt="Docs" />
          <span>Docs</span>
        </button>
        <button className="footer-button" onClick={() => navigate('/ocr')}>
          <img src="https://img.icons8.com/ios-filled/24/ffffff/camera.png" alt="OCR" />
          <span>OCR</span>
        </button>
        <button className="footer-button" onClick={() => navigate('/relatorios')}>
          <img src="https://img.icons8.com/ios-filled/24/ffffff/combo-chart.png" alt="Relatórios" />
          <span>Relatórios</span>
        </button>
      </footer>
    </div>
  );
}

export default Home;
