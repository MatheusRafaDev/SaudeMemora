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
import Layout from "./components/Layout";
import { obterPaciente } from "./services/pacienteService";


const isPacienteLoggedIn = () => {
  const data = localStorage.getItem("paciente");
  if (!data) return false;

  try {
    const paciente = JSON.parse(data);
    if (!paciente || !paciente.id) {
      localStorage.removeItem("paciente");
      return false;
    }
    return true;
  } catch (e) {
    localStorage.removeItem("paciente");
    return false;
  }
};

const AuthWrapper = ({ children }) => {
  const [authState, setAuthState] = useState({ loading: true, isAuthenticated: false });

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isPacienteLoggedIn();
      setAuthState({ loading: false, isAuthenticated: isAuth });
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
  const [authState, setAuthState] = useState({ loading: true, isAuthenticated: false });

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isPacienteLoggedIn();
      setAuthState({ loading: false, isAuthenticated: isAuth });
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
          <Route
            path="/"
            element={
              <PublicWrapper>
                <Navigate to="/login" replace />
              </PublicWrapper>
            }
          />

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

          <Route
            path="/home"
            element={
              <AuthWrapper>
                <Layout>
                  <Home />
                </Layout>
              </AuthWrapper>
            }
          />
          <Route
            path="/perfil"
            element={
              <AuthWrapper>
                <Layout>
                  <Perfil />
                </Layout>
              </AuthWrapper>
            }
          />
          <Route
            path="/formulario-medico"
            element={
              <AuthWrapper>
                <Layout>
                  <FormularioMedico />
                </Layout>
              </AuthWrapper>
            }
          />
          <Route
            path="/relatorios"
            element={
              <AuthWrapper>
                <Layout>
                  <RelatorioDocumentos />
                </Layout>
              </AuthWrapper>
            }
          />

          <Route
            path="/upload-documentos"
            element={
              <AuthWrapper>
                <Layout>
                  <UploadDocumentos />
                </Layout>
              </AuthWrapper>
            }
          />
          <Route
            path="/editar-documento"
            element={
              <AuthWrapper>
                <Layout>
                  <AlterarDocumento />
                </Layout>
              </AuthWrapper>
            }
          />
          <Route
            path="/alterar-perfil"
            element={
              <AuthWrapper>
                <Layout>
                  <EditarPerfil />
                </Layout>
              </AuthWrapper>
            }
          />
          <Route
            path="/meus-documentos"
            element={
              <AuthWrapper>
                <Layout>
                  <ListarDocumentos />
                </Layout>
              </AuthWrapper>
            }
          />
          <Route
            path="/visualizar-documento"
            element={
              <AuthWrapper>
                <Layout>
                  <VisualizadorDocumento />
                </Layout>
              </AuthWrapper>
            }
          />
          <Route
            path="/visualizar-ficha"
            element={
              <AuthWrapper>
                <Layout>
                  <VisualizarFichaMedica />
                </Layout>
              </AuthWrapper>
            }
          />

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
