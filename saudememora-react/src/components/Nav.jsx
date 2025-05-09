import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUser, FaFileAlt, FaUpload, FaChartBar, FaPlusCircle } from 'react-icons/fa';

const Nav = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center font-weight-bold" to="/home">

          <span style={{ fontWeight: 'bold' }}>SaúdeMemora</span> {/* Texto em negrito */}
        </Link>
        

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item me-3">
              <Link className="nav-link" to="/perfil">
                <FaUser /> <span className="d-none d-lg-inline">Perfil</span>
              </Link>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link" to="/meus-documentos">
                <FaFileAlt /> <span className="d-none d-lg-inline">Documentos</span>
              </Link>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link" to="/upload-documentos">
                <FaUpload /> <span className="d-none d-lg-inline">Processamento de doc</span>
              </Link>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link" to="/relatorios">
                <FaChartBar /> <span className="d-none d-lg-inline">Relatórios</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
