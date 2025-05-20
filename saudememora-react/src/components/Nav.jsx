import { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Nav = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/home">
          <span className="d-flex align-items-center text-white fw-semibold" style={{ fontSize: '1.5rem' }}>
            <i className="bi bi-heart-pulse me-2" style={{ color: '#7ad6ff' }}></i>
            <span className="d-none d-sm-inline">SaúdeMemora</span>
          </span>
        </Link>

        <button 
          className="navbar-toggler border-0 p-2" 
          type="button" 
          aria-controls="navbarNav"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          <i className="bi bi-list text-white" style={{ fontSize: '1.8rem' }}></i>
        </button>

        <div className={`collapse navbar-collapse ${open ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link 
                className="nav-link d-flex align-items-center py-3 px-3 rounded mx-2 my-1 hover-effect"
                to="/perfil"
                onClick={() => setOpen(false)} // fecha menu ao clicar
              >
                <i className="bi bi-person-circle me-2" style={{ fontSize: '1.2rem' }}></i>
                <span className="fw-medium">Perfil</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className="nav-link d-flex align-items-center py-3 px-3 rounded mx-2 my-1 hover-effect" 
                to="/meus-documentos"
                onClick={() => setOpen(false)}
              >
                <i className="bi bi-file-earmark-medical me-2" style={{ fontSize: '1.2rem' }}></i>
                <span className="fw-medium">Documentos</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className="nav-link d-flex align-items-center py-3 px-3 rounded mx-2 my-1 hover-effect" 
                to="/upload-documentos"
                onClick={() => setOpen(false)}
              >
                <i className="bi bi-cloud-arrow-up me-2" style={{ fontSize: '1.2rem' }}></i>
                <span className="fw-medium">Processamento</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className="nav-link d-flex align-items-center py-3 px-3 rounded mx-2 my-1 hover-effect" 
                to="/relatorios"
                onClick={() => setOpen(false)}
              >
                <i className="bi bi-clipboard2-data me-2" style={{ fontSize: '1.2rem' }}></i>
                <span className="fw-medium">Relatórios</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <style>{`
        .hover-effect {
          transition: all 0.3s ease;
        }
        .hover-effect:hover {
          background-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }
        @media (max-width: 992px) {
          .navbar-collapse {
            background-color: #0d6efd;
            border-radius: 0.5rem;
            margin-top: 0.5rem;
            padding: 0.5rem;
          }
          .nav-link {
            margin: 0.25rem 0;
          }
        }
      `}</style>
    </nav>
  );
};

export default Nav;
