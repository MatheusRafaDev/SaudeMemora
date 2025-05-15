import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// import "@fortawesome/fontawesome-free/css/all.min.css"; // Importando os ícones do FontAwesome

const Nav = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        
        <Link className="navbar-brand d-flex align-items-center" to="/home">
          <h1 className="mb-0 d-flex align-items-center text-white" style={{ fontSize: '1.5rem' }}>
            <i className="fas fa-heartbeat me-2"></i>Saúde Memora
          </h1>
        </Link>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item me-3">
              <Link className="nav-link" to="/perfil">
                <i className="fas fa-user"></i>{" "}
                <span className="d-none d-lg-inline">Perfil</span>
              </Link>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link" to="/meus-documentos">
                <i className="fas fa-file-alt"></i>{" "}
                <span className="d-none d-lg-inline">Documentos</span>
              </Link>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link" to="/upload-documentos">
                <i className="fas fa-upload"></i>{" "}
                <span className="d-none d-lg-inline">Processamento </span>
              </Link>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link" to="/relatorios">
                <i className="fas fa-chart-bar"></i>{" "}
                <span className="d-none d-lg-inline">Relatórios</span>
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
