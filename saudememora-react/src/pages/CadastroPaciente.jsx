import React, { useState } from "react";
import { IMaskInput } from "react-imask";
import { cadastrarPaciente } from "../services/pacienteService";
import { useNavigate } from "react-router-dom";
import "../styles/CadastroPaciente.css";
import "bootstrap/dist/css/bootstrap.min.css";

const CadastroPaciente = () => {
  const navigate = useNavigate();
  const [aceitaTermos, setAceitaTermos] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    dataNascimento: "",
    sexo: "",
    email: "",
    telefone: "",
    endereco: "",
    senha: "",
    confirmarSenha: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const { nome, cpf, dataNascimento, sexo, senha, confirmarSenha } = formData;
    if (
      !nome ||
      !cpf ||
      !dataNascimento ||
      !sexo ||
      !senha ||
      !confirmarSenha
    ) {
      setError("Todos os campos são obrigatórios!");
      return false;
    }

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem!");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    // Remove o campo confirmarSenha antes de enviar ao backend
    const { confirmarSenha, ...dadosParaBackend } = formData;

    const result = await cadastrarPaciente(dadosParaBackend);

    if (result.success) {
      localStorage.setItem("paciente", JSON.stringify(result.dados));
      navigate("/formulario-medico");
    } else {
      setError(result.message || "Erro desconhecido");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="saude-card shadow-sm p-3 rounded bg-white">
        <div className="card-body">
          <h2 className="text-center mb-3">Criar conta</h2>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {typeof error === "object" ? error.message : error}
              </div>
            )}

            <div className="mb-2">
              <label className="form-label fs-sm">
                Nome completo <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="form-control form-control-sm"
                placeholder="Digite o nome completo"
                required
              />
            </div>

            <div className="mb-2">
              <label className="form-label fs-sm">
                CPF <span className="text-danger">*</span>
              </label>
              <IMaskInput
                mask="000.000.000-00"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                className="form-control form-control-sm"
                placeholder="Somente números (11 dígitos)"
                required
              />
            </div>

            <div className="mb-2">
              <label className="form-label fs-sm">
                Data de nascimento <span className="text-danger">*</span>
              </label>
              <IMaskInput
                mask="00/00/0000"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleChange}
                className="form-control form-control-sm"
                placeholder="DD/MM/AAAA"
                required
              />
            </div>

            <div className="mb-2">
              <label className="form-label fs-sm">
                Sexo <span className="text-danger">*</span>
              </label>
              <select
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                className="form-select form-select-sm"
                required
              >
                <option value="">Selecione</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Outro</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="form-label fs-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control form-control-sm"
                placeholder="exemplo@email.com"
              />
            </div>

            <div className="mb-2">
              <label className="form-label fs-sm">Telefone</label>
              <IMaskInput
                mask="(00) 00000-0000"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="form-control form-control-sm"
                placeholder="(99) 99999-9999"
              />
            </div>

            <div className="mb-2">
              <label className="form-label fs-sm">Endereço</label>
              <input
                type="text"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                className="form-control form-control-sm"
                placeholder="Rua, número, bairro..."
              />
            </div>

            <div className="mb-2">
              <label className="form-label fs-sm">
                Senha <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                className="form-control form-control-sm"
                placeholder="Digite uma senha"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fs-sm">
                Confirmar Senha <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                className="form-control form-control-sm"
                placeholder="Repita a senha"
                required
              />
            </div>

            <div className="form-check mt-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="termos"
                checked={aceitaTermos}
                onChange={() => setAceitaTermos(!aceitaTermos)}
              />
              <label className="form-check-label fs-sm" htmlFor="termos">
                Aceito os <a href="#">termos de uso e privacidade de dados</a>
              </label>
            </div>

            <div className="d-flex justify-content-center mt-3">
              <button
                type="submit"
                className="btn btn-outline-primary btn-sm px-4"
                disabled={!aceitaTermos}
              >
                Próximo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroPaciente;
