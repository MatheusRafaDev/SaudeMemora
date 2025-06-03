import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Nav = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);
  const closeMenu = () => setOpen(false);

  const menuItems = [
    { path: "/home", icon: "bi-house", text: "Início" },
    { path: "/perfil", icon: "bi-person", text: "Perfil" },
    { path: "/meus-documentos", icon: "bi-file-earmark-medical", text: "Documentos" },
    { path: "/upload-documentos", icon: "bi-cloud-arrow-up", text: "Processar" },
    { path: "/visualizar-ficha", icon: "bi-file-text", text: "Ficha Médica" },
    { path: "/relatorios", icon: "bi-clipboard2-data", text: "Relatórios" }
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid px-3">
        {/* Logo */}
        <Link 
          className="navbar-brand d-flex align-items-center py-2" 
          to="/home" 
          onClick={closeMenu}
        >
          <i className="bi bi-heart-pulse me-2" style={{ fontSize: '1.8rem', color: '#7ad6ff' }}></i>
          <span className="d-none d-sm-inline fw-semibold" style={{ fontSize: '1.2rem' }}>SaúdeMemora</span>
        </Link>

        {/* Botão Hamburguer */}
        <button 
          className="navbar-toggler border-0 p-1" 
          type="button"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <i className={`bi ${open ? "bi-x-lg" : "bi-list"}`} style={{ fontSize: '1.8rem', color: 'white' }}></i>
        </button>

        {/* Itens do Menu */}
        <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto">
            {menuItems.map((item, index) => (
              <li className="nav-item" key={index}>
                <Link 
                  className="nav-link d-flex align-items-center py-2 px-3 rounded mx-lg-2 my-1 hover-effect"
                  to={item.path}
                  onClick={closeMenu}
                >
                  <i className={`bi ${item.icon} me-2`} style={{ fontSize: '1.2rem' }}></i>
                  <span className="fw-medium">{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx>{`
        .hover-effect {
          transition: all 0.2s ease;
        }
        .hover-effect:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        @media (max-width: 992px) {
          .navbar-collapse {
            background-color: #0d6efd;
            margin-top: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          .nav-link {
            margin: 0.25rem 0;
            padding: 0.75rem 1rem !important;
          }
        }
        
        @media (max-width: 576px) {
          .navbar-brand {
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
          }
          .nav-link {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Nav;