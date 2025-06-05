import React, { useState } from "react";
import { IMaskInput } from "react-imask";
import { cadastrarPaciente } from "../services/pacienteService";
import { useNavigate } from "react-router-dom";
import "../styles/CadastroPaciente.css";
import "bootstrap/dist/css/bootstrap.min.css";

const CadastroPaciente = () => {
  const navigate = useNavigate();
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    if (!aceitaTermos) {
      setError("Você deve aceitar os termos para continuar");
      return false;
    }

    if (!nome || !cpf || !dataNascimento || !sexo || !senha || !confirmarSenha) {
      setError("Todos os campos marcados com * são obrigatórios!");
      return false;
    }

    if (senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
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
    setIsSubmitting(true);

    const isValid = validateForm();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    // Remove o campo confirmarSenha antes de enviar ao backend
    const { confirmarSenha, ...dadosParaBackend } = formData;

    try {
      const result = await cadastrarPaciente(dadosParaBackend);

      if (result.success) {
        localStorage.setItem("paciente", JSON.stringify(result.dados));
        navigate("/formulario-medico");
      } else {
        setError(result.message || "Erro ao cadastrar. Tente novamente.");
      }
    } catch (err) {
      setError("Erro na conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para formatar a data para o padrão brasileiro
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split('/');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm rounded-3 w-100 mx-3 mx-md-4" style={{ maxWidth: "500px" }}>
        <div className="card-body p-3 p-md-4">
          <h2 className="text-center mb-4">Criar conta</h2>
          
          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                {error}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setError("")}
                  aria-label="Close"
                ></button>
              </div>
            )}

            <div className="row g-2">
              {/* Nome */}
              <div className="col-12">
                <label className="form-label">
                  Nome completo <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Digite seu nome completo"
                  required
                  autoComplete="name"
                />
              </div>

              {/* CPF e Data Nascimento */}
              <div className="col-md-6">
                <label className="form-label">
                  CPF <span className="text-danger">*</span>
                </label>
                <IMaskInput
                  mask="000.000.000-00"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="000.000.000-00"
                  required
                  autoComplete="off"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Nascimento <span className="text-danger">*</span>
                </label>
                <IMaskInput
                  mask="00/00/0000"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="DD/MM/AAAA"
                  required
                  autoComplete="bday"
                />
              </div>

              {/* Sexo e Email */}
              <div className="col-md-6">
                <label className="form-label">
                  Sexo <span className="text-danger">*</span>
                </label>
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="O">Outro</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="exemplo@email.com"
                  autoComplete="email"
                />
              </div>

              {/* Telefone e Endereço */}
              <div className="col-md-6">
                <label className="form-label">Telefone</label>
                <IMaskInput
                  mask="(00) 00000-0000"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="(00) 00000-0000"
                  autoComplete="tel"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Endereço</label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Rua, número, bairro..."
                  autoComplete="address-line1"
                />
              </div>

              {/* Senhas */}
              <div className="col-md-6">
                <label className="form-label">
                  Senha <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength="6"
                  autoComplete="new-password"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Confirmar Senha <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Repita a senha"
                  required
                  minLength="6"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Termos */}
            <div className="form-check mt-3 mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="termos"
                checked={aceitaTermos}
                onChange={() => {
                  setAceitaTermos(!aceitaTermos);
                  if (error.includes("termos")) setError("");
                }}
                required
              />
              <label className="form-check-label small" htmlFor="termos">
                Li e aceito os <a href="#" className="text-decoration-none">termos de uso</a> e <a href="#" className="text-decoration-none">política de privacidade</a>
              </label>
            </div>

            {/* Botões */}
            <div className="d-grid gap-2 d-md-flex justify-content-md-between mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary flex-grow-1 me-md-2"
                onClick={() => navigate("/login")}
              >
                Já tenho conta
              </button>
              
              <button
                type="submit"
                className="btn btn-primary flex-grow-1 ms-md-2"
                disabled={!aceitaTermos || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Cadastrando...
                  </>
                ) : (
                  "Cadastrar"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroPaciente;