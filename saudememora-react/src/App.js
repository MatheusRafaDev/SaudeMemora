import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CadastroPaciente from "./pages/CadastroPaciente";
import FormularioMedico from "./pages/FormularioMedico";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
      
        <Route path="/criar-conta" element={<CadastroPaciente />} />
        <Route path="/formulario-medico" element={<FormularioMedico/>} />
      </Routes>
    </Router>
  );
}

export default App;
