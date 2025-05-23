import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { buscarFichaMedica } from "../services/FichaMedicaService";

import "jspdf-autotable";
import Nav from "../components/Nav";

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
        <div className="container mt-5 text-center">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3 fs-5">Carregando ficha médica...</p>
        </div>
      </>
    );
  }

  if (!ficha) {
    return (
      <>
        <Nav />
        <div className="container mt-5">
          <div className="alert alert-warning text-center">
            <p className="mb-3">{mensagem || "Nenhuma ficha médica encontrada."}</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/formulario-medico")}
            >
              Criar Ficha Médica
            </button>
          </div>
        </div>
      </>
    );
  }

  const dadosTabela = [
    [
      "Tratamento médico:",
      formatarResposta(ficha.tratamentoMedico, ficha.tratamentoMedicoExtra),
    ],
    [
      "Grávida:",
      paciente.sexo === "F"
        ? formatarResposta(ficha.gravidez, ficha.gravidezExtra)
        : "Não se aplica",
    ],
    ["Faz regime:", formatarResposta(ficha.regime, ficha.regimeExtra)],
    ["Diabetes:", formatarResposta(ficha.diabetes, ficha.diabetesExtra)],
    ["Alergias:", formatarResposta(ficha.alergias, ficha.alergiasExtra)],
    ["Febre reumática:", formatarResposta(ficha.reumatica)],
    ["Problemas de coagulação:", formatarResposta(ficha.coagulacao)],
    [
      "Doença cardiovascular:",
      formatarResposta(ficha.doencaCardioVascular, ficha.doencaCardioVascularExtra),
    ],
    ["Problemas hemorrágicos:", formatarResposta(ficha.hemorragicos)],
    [
      "Problemas com anestesia:",
      formatarResposta(ficha.problemasAnestesia, ficha.problemasAnestesiaExtra),
    ],
    [
      "Alergia a medicamentos:",
      formatarResposta(ficha.alergiaMedicamentos, ficha.alergiaMedicamentosExtra),
    ],
    ["Teve hepatite:", formatarResposta(ficha.hepatite, ficha.hepatiteExtra)],
    ["Portador do HIV:", formatarResposta(ficha.hiv)],
    ["Usa/Usou drogas:", formatarResposta(ficha.drogas)],
    ["Fumante:", formatarResposta(ficha.fumante)],
    ["Já fumou:", formatarResposta(ficha.fumou)],
    ["Pressão arterial:", ficha.pressao || "Não informado"],
    [
      "Problemas respiratórios:",
      formatarResposta(ficha.respiratorio, ficha.respiratorioExtra),
    ],
    [
      "Doenças na família:",
      formatarResposta(ficha.doencaFamilia, ficha.doencaFamiliaExtra),
    ],
  ];

  return (
    <>
      <Nav />
      <div className="container mt-5 mb-5">
        <div className="card shadow rounded-4 border-0">
          <div className="card-body p-4">
            <h3 className="text-center mb-4 fw-bold text-primary">Ficha Médica</h3>
            <div className="mb-4">
              <h5 className="fw-semibold">Paciente</h5>
              <p className="mb-1">
                <strong>Nome:</strong> {paciente.nome || "Não informado"}
              </p>
              <p className="mb-1">
                <strong>CPF:</strong> {paciente.cpf || "Não informado"}
              </p>
              <p className="mb-1">
                <strong>Data Nascimento:</strong> {paciente.dataNascimento || "Não informado"}
              </p>
              <p className="mb-0">
                <strong>Sexo:</strong> {paciente.sexo === "M" ? "Masculino" : "Feminino"}
              </p>
            </div>

            <h5 className="fw-semibold mb-3 border-bottom pb-2">Dados de Saúde</h5>
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <tbody>
                  {dadosTabela.map(([pergunta, resposta], idx) => (
                    <tr key={idx}>
                      <th style={{ width: "40%" }}>{pergunta}</th>
                      <td>{resposta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-center mt-3">
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate("/formulario-medico")}
              >
                Editar Ficha Médica
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VisualizarFichaMedica;
