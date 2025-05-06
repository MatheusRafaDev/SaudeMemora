import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CadastroPaciente from "./pages/CadastroPaciente";
import FormularioMedico from "./pages/FormularioMedico";
import OCRLeituraCursiva from "./pages/OCRLeituraCursiva";
import Perfil from "./pages/Perfil";
import ListarDocumentos from "./pages/ListarDocumentos";//pagina de listar docs

const isPacienteLoggedIn = () => {
  const paciente = JSON.parse(localStorage.getItem("paciente")) || {};
  return Object.keys(paciente).length > 0;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/criar-conta" element={<CadastroPaciente />} />

        {/* Rotas protegidas */}
        <Route
          path="/home"
          element={
            isPacienteLoggedIn()
              ? <Home />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/perfil"
          element={
            isPacienteLoggedIn()
              ? <Perfil />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/formulario-medico"
          element={
            isPacienteLoggedIn()
              ? <FormularioMedico />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/ocr"
          element={
            isPacienteLoggedIn()
              ? <OCRLeituraCursiva />
              : <Navigate to="/login" replace />
          }
        />

        {/* rota de listagem de documentos */}
        <Route
          path="/listar-documentos"
          element={
            isPacienteLoggedIn()
              ? <ListarDocumentos />
              : <Navigate to="/login" replace />
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
