import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { buscarFichaMedica } from "../services/FichaMedicaService";
import Nav from "../components/Nav";
import "../styles/VisualizarFichaMedica.css";

const VisualizarFichaMedica = () => {
  const [ficha, setFicha] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const paciente = JSON.parse(localStorage.getItem("paciente")) || {};

  useEffect(() => {
    const carregarFicha = async () => {
      if (!paciente.id) {
        setMensagem("Paciente não identificado.");
        setCarregando(false);
        return;
      }

      try {
        const response = await buscarFichaMedica(paciente.id);
        if (response.success) {
          setFicha(response.data);
        } else {
          setMensagem(response.message || "Ficha médica não encontrada.");
        }
      } catch (error) {
        console.error("Erro ao buscar ficha:", error);
        setMensagem("Erro ao carregar ficha médica.");
      } finally {
        setCarregando(false);
      }
    };

    carregarFicha();
  }, [paciente.id]);

  const formatarResposta = (valor, extra) => {
    if (valor === true || valor === "true")
      return extra ? `Sim (${extra})` : "Sim";
    if (valor === false || valor === "false") return "Não";
    return valor || "Não informado";
  };

  if (carregando) {
    return (
      <>
        <Nav />
        <div className="container mt-3 text-center">
          <p className="mt-2">Carregando ficha médica...</p>
        </div>
      </>
    );
  }

  if (!ficha) {
    return (
      <>
        <Nav />
        <div className="container mt-3">
          <div className="alert alert-warning text-center py-3 px-2">
            <p className="mb-3 fs-6">
              {mensagem || "Nenhuma ficha médica encontrada."}
            </p>
            <button
              className="btn btn-primary btn-sm px-3"
              onClick={() => navigate("/formulario-medico")}
            >
              Criar Ficha
            </button>
          </div>
        </div>
      </>
    );
  }

  const dadosSaude = [
    {
      pergunta: "Tratamento médico",
      valor: ficha.tratamentoMedico,
      extra: ficha.tratamentoMedicoExtra,
    },
    {
      pergunta: "Grávida",
      valor: paciente.sexo === "F" ? ficha.gravidez : null,
      extra: ficha.gravidezExtra,
      condicional: paciente.sexo === "F",
    },
    { pergunta: "Faz regime", valor: ficha.regime, extra: ficha.regimeExtra },
    { pergunta: "Diabetes", valor: ficha.diabetes, extra: ficha.diabetesExtra },
    { pergunta: "Alergias", valor: ficha.alergias, extra: ficha.alergiasExtra },
    { pergunta: "Febre reumática", valor: ficha.reumatica },
    { pergunta: "Problemas de coagulação", valor: ficha.coagulacao },
    {
      pergunta: "Doença cardiovascular",
      valor: ficha.doencaCardioVascular,
      extra: ficha.doencaCardioVascularExtra,
    },
    { pergunta: "Problemas hemorrágicos", valor: ficha.hemorragicos },
    {
      pergunta: "Problemas com anestesia",
      valor: ficha.problemasAnestesia,
      extra: ficha.problemasAnestesiaExtra,
    },
    {
      pergunta: "Alergia a medicamentos",
      valor: ficha.alergiaMedicamentos,
      extra: ficha.alergiaMedicamentosExtra,
    },
    {
      pergunta: "Teve hepatite",
      valor: ficha.hepatite,
      extra: ficha.hepatiteExtra,
    },
    { pergunta: "Portador do HIV", valor: ficha.hiv },
    { pergunta: "Usa/Usou drogas", valor: ficha.drogas },
    { pergunta: "Fumante", valor: ficha.fumante },
    { pergunta: "Já fumou", valor: ficha.fumou },
    { pergunta: "Pressão arterial", valor: ficha.pressao, isText: true },
    {
      pergunta: "Problemas respiratórios",
      valor: ficha.respiratorio,
      extra: ficha.respiratorioExtra,
    },
    {
      pergunta: "Doenças na família",
      valor: ficha.doencaFamilia,
      extra: ficha.doencaFamiliaExtra,
    },
  ];

  return (
    <>
      <Nav />
      <button
        onClick={() => navigate(-1)}
        className="btn btn-link text-secondary"
      >
        ← Voltar
      </button>
      <div className="container container-custom">
        <div className="header-flex">
          <div>
            <h4 className="fw-bold text-primary">Ficha Médica</h4>
            <small className="text-muted">Anamnese</small>
          </div>
          <button
            className="btn btn-primary btn-sm btn-edit"
            onClick={() => navigate("/formulario-medico")}
          >
            Editar Ficha
          </button>
        </div>
        <div className="section">
          <h6 className="fw-bold mb-2">Paciente</h6>
          <div className="d-flex flex-column gap-1">
            <p className="mb-0 small">
              <strong>Nome:</strong> {paciente.nome || "Não informado"}
            </p>
            <p className="mb-0 small">
              <strong>CPF:</strong> {paciente.cpf || "Não informado"}
            </p>
            <p className="mb-0 small">
              <strong>Nascimento:</strong>{" "}
              {paciente.dataNascimento || "Não informado"}
            </p>
          </div>
        </div>

        <div className="section">
          <h6 className="fw-bold mb-2">Dados de Saúde</h6>
          <div className="list-group list-group-flush">
            {dadosSaude.map((item, idx) => {
              if (item.condicional === false) return null;

              const resposta = item.isText
                ? item.valor || "Não informado"
                : formatarResposta(item.valor, item.extra);

              return (
                <div
                  key={idx}
                  className="list-group-item px-0 py-2 border-0 d-flex flex-column flex-md-row justify-content-between align-items-start"
                  style={{ borderBottom: "1px solid #eee" }}
                >
                  <span className="small fw-semibold">{item.pergunta}:</span>
                  <span
                    className="small text-muted mt-1 mt-md-0 text-start text-md-end"
                    style={{ minWidth: "100px" }}
                  >
                    {resposta}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default VisualizarFichaMedica;
