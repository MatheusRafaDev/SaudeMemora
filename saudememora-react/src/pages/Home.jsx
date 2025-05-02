import React from 'react';

import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <header className="header">
        <button className="nav-button">
          <img src="https://img.icons8.com/ios-filled/50/ffffff/menu.png" alt="Menu" />
        </button>
        <h1 className="title">SaúdeMemora</h1>
      </header>

      <main className="main-content">
        <div className="cards-grid">
          {/* Card 1: Meu Perfil */}
          <div className="card">
            <img src="https://img.icons8.com/ios-filled/50/555555//user-male.png" alt="Meu Perfil" />
            <span>Meu Perfil</span>
          </div>
          {/* Card 2: Meus Documentos */}
          <div className="card">
            <img src="https://img.icons8.com/ios-filled/50/555555/document.png" alt="Meus Documentos" />
            <span>Meus Documentos</span>
          </div>
          {/* Card 3: OCR */}
          <div className="card">
            <img src="https://img.icons8.com/ios-filled/50/555555//camera.png" alt="OCR" />
            <span>OCR</span>
          </div>
          {/* Card 4: Relatórios */}
          <div className="card">
            <img src="https://img.icons8.com/ios-filled/50/555555//combo-chart.png" alt="Relatórios" />
            <span>Relatórios</span>
          </div>
        </div>
      </main>

      <footer className="footer">
        <button className="footer-button">
          <img src="https://img.icons8.com/ios-filled/24/ffffff/home.png" alt="Home" />
          <span>Home</span>
        </button>
        <button className="footer-button">
          <img src="https://img.icons8.com/ios-filled/24/ffffff/user-male.png" alt="Perfil" />
          <span>Perfil</span>
        </button>
        <button className="footer-button">
          <img src="https://img.icons8.com/ios-filled/24/ffffff/document.png" alt="Docs" />
          <span>Docs</span>
        </button>
        <button className="footer-button">
          <img src="https://img.icons8.com/ios-filled/24/ffffff/camera.png" alt="OCR" />
          <span>OCR</span>
        </button>
        <button className="footer-button">
          <img src="https://img.icons8.com/ios-filled/24/ffffff/combo-chart.png" alt="Relatórios" />
          <span>Relatórios</span>
        </button>
      </footer>
    </div>
  );
}

export default Home;
