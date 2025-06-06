import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { buscarFichaMedica } from "../services/FichaMedicaService";

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
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" />
        <p className="mt-2">Carregando ficha médica...</p>
      </div>
    );
  }

  if (!ficha) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center py-4 px-3 shadow-sm rounded">
          <p className="mb-3 fs-6 fw-semibold">
            {mensagem || "Nenhuma ficha médica encontrada."}
          </p>
          <button
            className="btn btn-primary px-4"
            onClick={() => navigate("/formulario-medico")}
          >
            Criar Ficha
          </button>
        </div>
      </div>
    );
  }

  const dadosSaude = [
    { pergunta: "Tratamento médico", valor: ficha.tratamentoMedico, extra: ficha.tratamentoMedicoExtra },
    { pergunta: "Grávida", valor: paciente.sexo === "F" ? ficha.gravidez : null, extra: ficha.gravidezExtra, condicional: paciente.sexo === "F" },
    { pergunta: "Faz regime", valor: ficha.regime, extra: ficha.regimeExtra },
    { pergunta: "Diabetes", valor: ficha.diabetes, extra: ficha.diabetesExtra },
    { pergunta: "Alergias", valor: ficha.alergias, extra: ficha.alergiasExtra },
    { pergunta: "Febre reumática", valor: ficha.reumatica },
    { pergunta: "Problemas de coagulação", valor: ficha.coagulacao },
    { pergunta: "Doença cardiovascular", valor: ficha.doencaCardioVascular, extra: ficha.doencaCardioVascularExtra },
    { pergunta: "Problemas hemorrágicos", valor: ficha.hemorragicos },
    { pergunta: "Problemas com anestesia", valor: ficha.problemasAnestesia, extra: ficha.problemasAnestesiaExtra },
    { pergunta: "Alergia a medicamentos", valor: ficha.alergiaMedicamentos, extra: ficha.alergiaMedicamentosExtra },
    { pergunta: "Teve hepatite", valor: ficha.hepatite, extra: ficha.hepatiteExtra },
    { pergunta: "Portador do HIV", valor: ficha.hiv },
    { pergunta: "Usa/Usou drogas", valor: ficha.drogas },
    { pergunta: "Fumante", valor: ficha.fumante },
    { pergunta: "Já fumou", valor: ficha.fumou },
    { pergunta: "Pressão arterial", valor: ficha.pressao, isText: true },
    { pergunta: "Problemas respiratórios", valor: ficha.respiratorio, extra: ficha.respiratorioExtra },
    { pergunta: "Doenças na família", valor: ficha.doencaFamilia, extra: ficha.doencaFamiliaExtra },
  ];

  return (
    <div className="container container-custom mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold text-primary mb-1">Ficha Médica</h4>
          <span className="text-muted small">Informações de saúde</span>
        </div>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => navigate("/formulario-medico")}
        >
          Editar Ficha
        </button>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h6 className="fw-bold mb-3 text-secondary">Dados do Paciente</h6>
          <p className="mb-1 small"><strong>Nome:</strong> {paciente.nome || "Não informado"}</p>
          <p className="mb-1 small"><strong>CPF:</strong> {paciente.cpf || "Não informado"}</p>
          <p className="mb-0 small"><strong>Nascimento:</strong> {paciente.dataNascimento || "Não informado"}</p>
        </div>
      </div>

      <div className="card shadow-sm mb-5">
        <div className="card-body">
          <h6 className="fw-bold mb-3 text-secondary">Condições de Saúde</h6>
          {dadosSaude.map((item, idx) => {
            if (item.condicional === false) return null;
            const resposta = item.isText
              ? item.valor || "Não informado"
              : formatarResposta(item.valor, item.extra);

            return (
              <div key={idx} className="d-flex justify-content-between border-bottom py-2">
                <span className="fw-semibold">{item.pergunta}</span>
                <span className="text-muted">{resposta}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VisualizarFichaMedica;
