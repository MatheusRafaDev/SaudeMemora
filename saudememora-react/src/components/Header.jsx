import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaHeartbeat } from 'react-icons/fa'; // Importando o ícone
import '../styles/Header.css';

function Header({ nome }) {
  const navigate = useNavigate();

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <div className="container">
        <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
           <h1 className="text-primary mb-0">
              <i className="fas fa-heartbeat me-2"></i>Saúde Memora
            </h1>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            <Nav.Link onClick={() => navigate('/meus-documentos')}>Documentos</Nav.Link>
            <Nav.Link onClick={() => navigate('/uploud-documento')}>Upload</Nav.Link>
            <Nav.Link onClick={() => navigate('/relatorios')}>Relatórios</Nav.Link>
            <Nav.Link onClick={() => navigate('/perfil')}>{nome || 'Perfil'}</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default Header;
