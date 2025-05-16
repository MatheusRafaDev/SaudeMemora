import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CadastroPaciente from "./pages/CadastroPaciente";
import FormularioMedico from "./pages/FormularioMedico";
import OCRLeituraCursiva from "./pages/OCRLeituraCursiva";
import UploadDocumentos from "./pages/UploadDocumentos";
import Perfil from "./pages/Perfil";
//import EditarPaciente from "./pages/EditarPaciente";
import ListarDocumentos from "./pages/ListarDocumentos";
import EditarPerfil from "./pages/EditarPerfil";
import RelatorioDocumentos from "./pages/RelatorioDocumentos";
import VisualizadorDocumento from "./pages/VisualizadorDocumento";

const isPacienteLoggedIn = () => {
  const data = localStorage.getItem("paciente");
  if (!data) return false;

  try {
    const paciente = JSON.parse(data);
    return paciente && Object.keys(paciente).length > 0;
  } catch (e) {
    console.error("Erro ao fazer parse do paciente:", e);
    return false;
  }
};


function App() {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<Login />} />
        
    
        <Route 
          path="/home" 
          element={isPacienteLoggedIn() ? <Home /> : <Navigate to="/login" />} 
        />

        <Route path="/relatorio-documentos" element={<RelatorioDocumentos />}/>

        <Route path="/criar-conta" element={<CadastroPaciente />} />
        <Route path="/perfil" element={<Perfil />} />

        <Route path="/formulario-medico" element={<FormularioMedico />} />
        <Route path="/relatorios" element={<RelatorioDocumentos />}/>
        <Route path="/ocr" element={<OCRLeituraCursiva />} />

        <Route path="/upload-documentos" element={<UploadDocumentos />} />

        <Route path="/alterar-perfil" element={<EditarPerfil />}/>

        <Route path="/meus-documentos" element={<ListarDocumentos />}/>

        <Route path="/visualizar-documento" element={<VisualizadorDocumento />}/>
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

//<Route path="*" element={<Navigate to="/login" />} />

export default App;
