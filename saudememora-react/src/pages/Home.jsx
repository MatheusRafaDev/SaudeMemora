import React, { useState } from 'react';
import '../styles/Home.css';

const Dashboard = () => {
  const [activeScreen, setActiveScreen] = useState('home');

  const navigate = (screen) => {
    setActiveScreen(screen);
  };

  return (
    <div className="dashboard">
      <header className="header">
        <button className="btn-home" onClick={() => navigate('home')}>
          <img
            src="https://img.icons8.com/ios-filled/50/ffffff/home.png"
            alt="Home"
          />
        </button>
        SaúdeMemora
      </header>

      <main className="main">
        <div className="card" onClick={() => navigate('perfil')}>
          <img
            className="icon"
            src="https://img.icons8.com/ios-filled/100/3498db/user.png"
            alt="Meu Perfil"
          />
          <span>Meu Perfil</span>
        </div>
        <div className="card" onClick={() => navigate('documentos')}>
          <img
            className="icon"
            src="https://img.icons8.com/ios-filled/100/3498db/document.png"
            alt="Meus Documentos"
          />
          <span>Meus Documentos</span>
        </div>
        <div className="card" onClick={() => navigate('ocr')}>
          <img
            className="icon"
            src="https://img.icons8.com/ios-filled/100/3498db/camera.png"
            alt="OCR"
          />
          <span>OCR</span>
        </div>
        <div className="card" onClick={() => navigate('relatorios')}>
          <img
            className="icon"
            src="https://img.icons8.com/ios-filled/100/3498db/combo-chart.png"
            alt="Relatórios"
          />
          <span>Relatórios</span>
        </div>
      </main>

      <nav className="bottom-nav">
        <button
          className={activeScreen === 'home' ? 'active' : ''}
          onClick={() => navigate('home')}
        >
          <img
            src="https://img.icons8.com/ios-filled/50/555555/home.png"
            alt="Home"
          />
          Home
        </button>
        <button
          className={activeScreen === 'perfil' ? 'active' : ''}
          onClick={() => navigate('perfil')}
        >
          <img
            src="https://img.icons8.com/ios-filled/50/555555/user.png"
            alt="Perfil"
          />
          Perfil
        </button>
        <button
          className={activeScreen === 'documentos' ? 'active' : ''}
          onClick={() => navigate('documentos')}
        >
          <img
            src="https://img.icons8.com/ios-filled/50/555555/document.png"
            alt="Docs"
          />
          Docs
        </button>
        <button
          className={activeScreen === 'ocr' ? 'active' : ''}
          onClick={() => navigate('ocr')}
        >
          <img
            src="https://img.icons8.com/ios-filled/50/555555/camera.png"
            alt="OCR"
          />
          OCR
        </button>
        <button
          className={activeScreen === 'relatorios' ? 'active' : ''}
          onClick={() => navigate('relatorios')}
        >
          <img
            src="https://img.icons8.com/ios-filled/50/555555/combo-chart.png"
            alt="Relatórios"
          />
          Relatórios
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
