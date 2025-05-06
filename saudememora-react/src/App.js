import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CadastroPaciente from "./pages/CadastroPaciente";
import FormularioMedico from "./pages/FormularioMedico";
import OCRLeituraCursiva from "./pages/OCRLeituraCursiva";
import Perfil from "./pages/Perfil";
import EditarPaciente from "./pages/EditarPaciente";


const isPacienteLoggedIn = () => {
  const paciente = JSON.parse(localStorage.getItem("paciente")) || {};
  return Object.keys(paciente).length > 0;  
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


        <Route path="/criar-conta" element={<CadastroPaciente />} />
        <Route path="/perfil" element={<Perfil />} />

        <Route path="/formulario-medico" element={<FormularioMedico />} />

        <Route path="/ocr" element={<OCRLeituraCursiva />} />

        <Route path="/alterar-perfil" element={<EditarPaciente />}/>

        
      </Routes>
    </Router>
  );
}

//<Route path="*" element={<Navigate to="/login" />} />

export default App;
