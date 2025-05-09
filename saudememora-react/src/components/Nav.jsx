import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


const Nav = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/home">SaúdeMemora</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/perfil">Perfil</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/alterar-perfil">Alterar Perfil</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/meus-documentos">Documentos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ocr">OCR</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/relatorios">Relatórios</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
