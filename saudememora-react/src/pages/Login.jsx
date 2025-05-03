import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginPaciente } from '../services/pacienteService';
import 'bootstrap/dist/css/bootstrap.min.css'; 


export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro(null);

    try {
      const result = await loginPaciente(email, senha);
      if (result.success) {

        localStorage.setItem("paciente", JSON.stringify(result.data));
        navigate("/home");
      } else {
        setErro(result.message || "Falha ao fazer login");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const mensagem =
          typeof err.response.data === "string"
            ? err.response.data
            : err.response.data.message || "Erro inesperado ao fazer login.";
        setErro(mensagem);
      } else {
        setErro("Erro ao conectar com o servidor.");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">SaúdeMemora</h2>
        <h3 className="text-center mb-3">Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              className="form-control"
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Digite seu email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="senha">Senha</label>
            <input
              className="form-control"
              type="password"
              id="senha"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
              placeholder="Digite sua senha"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Entrar</button>
          {erro && <p className="text-danger mt-3">{erro}</p>}
        </form>

        <div className="d-flex justify-content-between mt-4">
          <button onClick={() => navigate('/criar-conta')} className="btn btn-link">Criar conta</button>
          <button onClick={() => navigate('/esqueci-senha')} className="btn btn-link">Esqueci a senha</button>
        </div>
      </div>
    </div>
  );
}
