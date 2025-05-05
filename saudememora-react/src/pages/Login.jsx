import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginPaciente } from "../services/pacienteService";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../components/Footer";

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
    <div className="d-flex flex-column min-vh-100 bg-white">
      <main className="d-flex justify-content-center align-items-center flex-grow-1">
        <div
          className="p-3 rounded border w-100"
          style={{ maxWidth: "360px" }}
        >
          <h4 className="text-center mb-3">Login</h4>
          <form onSubmit={handleLogin}>
            <div className="mb-2">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                className="form-control"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-2">
              <label className="form-label" htmlFor="senha">Senha</label>
              <input
                className="form-control"
                type="password"
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-2">
              Entrar
            </button>

            {erro && <p className="text-danger mt-2 small">{erro}</p>}
          </form>

          <div className="d-flex justify-content-between mt-3">
            <button
              onClick={() => navigate("/criar-conta")}
              className="btn btn-link p-0"
            >
              Criar conta
            </button>
            <button
              onClick={() => navigate("/esqueci-senha")}
              className="btn btn-link p-0"
            >
              Esqueci a senha
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
