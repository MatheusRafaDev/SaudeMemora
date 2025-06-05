import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CadastroPaciente from "./pages/CadastroPaciente";
import FormularioMedico from "./pages/FormularioMedico";
import OCRLeituraCursiva from "./pages/OCRLeituraCursiva";
import UploadDocumentos from "./pages/UploadDocumentos";
import Perfil from "./pages/Perfil";
import ListarDocumentos from "./pages/ListarDocumentos";
import EditarPerfil from "./pages/EditarPerfil";
import RelatorioDocumentos from "./pages/RelatorioDocumentos";
import VisualizadorDocumento from "./pages/VisualizadorDocumento";
import VisualizarFichaMedica from "./pages/VisualizarFichaMedica";
import AlterarDocumento from "./pages/AlterarDocumento";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/global.css";
import { obterPaciente } from "./services/pacienteService";


let lastVerification = 0;
const CACHE_TIME = 5 * 60 * 1000; 

const isPacienteLoggedIn = async () => {
  const data = localStorage.getItem("paciente");
  if (!data) return false;

  try {
    const paciente = JSON.parse(data);
    
    if (!paciente?.id) {
      localStorage.removeItem("paciente");
      return false;
    }


    if (Date.now() - lastVerification < CACHE_TIME) {
      return true;
    }

    const response = await obterPaciente(paciente.id);
    
    if (!response.success) {
      localStorage.removeItem("paciente");
      return false;
    }


    lastVerification = Date.now();
    localStorage.setItem("paciente", JSON.stringify(response.data));
    return true;
  } catch (error) {
    console.error("Erro na verificação do paciente:", error);
    localStorage.removeItem("paciente");
    return false;
  }
};


const AuthWrapper = ({ children }) => {
  const [authState, setAuthState] = useState({
    loading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isPacienteLoggedIn();
      setAuthState({
        loading: false,
        isAuthenticated: isAuth,
      });
    };
    checkAuth();
  }, []);

  if (authState.loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return authState.isAuthenticated ? children : <Navigate to="/login" replace />;
};


const PublicWrapper = ({ children }) => {
  const [authState, setAuthState] = useState({
    loading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isPacienteLoggedIn();
      setAuthState({
        loading: false,
        isAuthenticated: isAuth,
      });
    };
    checkAuth();
  }, []);

  if (authState.loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return authState.isAuthenticated ? <Navigate to="/home" replace /> : children;
};

function App() {
  return (
    <div className="app-container">
      <Router>
        <Routes>
          {/* Rota raiz - redireciona conforme autenticação */}
          <Route
            path="/"
            element={
              <PublicWrapper>
                <Navigate to="/login" replace />
              </PublicWrapper>
            }
          />

          {/* Rotas públicas */}
          <Route
            path="/login"
            element={
              <PublicWrapper>
                <Login />
              </PublicWrapper>
            }
          />
          <Route
            path="/criar-conta"
            element={
              <PublicWrapper>
                <CadastroPaciente />
              </PublicWrapper>
            }
          />

          {/* Rotas protegidas */}
          <Route
            path="/home"
            element={
              <AuthWrapper>
                <Home />
              </AuthWrapper>
            }
          />
          <Route
            path="/perfil"
            element={
              <AuthWrapper>
                <Perfil />
              </AuthWrapper>
            }
          />
          <Route
            path="/formulario-medico"
            element={
              <AuthWrapper>
                <FormularioMedico />
              </AuthWrapper>
            }
          />
          <Route
            path="/relatorios"
            element={
              <AuthWrapper>
                <RelatorioDocumentos />
              </AuthWrapper>
            }
          />
          <Route
            path="/ocr"
            element={
              <AuthWrapper>
                <OCRLeituraCursiva />
              </AuthWrapper>
            }
          />
          <Route
            path="/upload-documentos"
            element={
              <AuthWrapper>
                <UploadDocumentos />
              </AuthWrapper>
            }
          />
          <Route
            path="/editar-documento"
            element={
              <AuthWrapper>
                <AlterarDocumento />
              </AuthWrapper>
            }
          />
          <Route
            path="/alterar-perfil"
            element={
              <AuthWrapper>
                <EditarPerfil />
              </AuthWrapper>
            }
          />
          <Route
            path="/meus-documentos"
            element={
              <AuthWrapper>
                <ListarDocumentos />
              </AuthWrapper>
            }
          />
          <Route
            path="/visualizar-documento"
            element={
              <AuthWrapper>
                <VisualizadorDocumento />
              </AuthWrapper>
            }
          />
          <Route
            path="/visualizar-ficha"
            element={
              <AuthWrapper>
                <VisualizarFichaMedica />
              </AuthWrapper>
            }
          />

          {/* Rota fallback - redireciona conforme autenticação */}
          <Route
            path="*"
            element={
              <PublicWrapper>
                <Navigate to="/login" replace />
              </PublicWrapper>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;