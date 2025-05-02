import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/Login.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:7070/api/paciente/login", {
        email,
        senha,
      });
      navigate("/home");
    } catch (err) {
      // Adicione algum tratamento de erro, se necessário
    }
  };

  return (
    <div className="body">
      <div className="box">
        <h2 className="title">Login</h2>
        <form onSubmit={handleLogin}>
          <label className="label" htmlFor="email">Email</label>
          <input
            className="input"
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="Digite seu email"
          />

          <label className="label" htmlFor="senha">Senha</label>
          <input
            className="input"
            type="password"
            id="senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
            placeholder="Digite sua senha"
          />

          <button type="submit" className="btn">Entrar</button>
        </form>

        <div className="auth-links">
          <button onClick={() => navigate('/criar-conta')} className="link-btn">Criar conta</button>
          <button onClick={() => navigate('/esqueci-senha')} className="link-btn">Esqueci a senha</button>
        </div>
      </div>
    </div>
  );
}
