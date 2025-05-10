import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ocrSpace } from "../ocr/ocrSpace";
import { aplicarCamposComOCR } from "../ocr/aplicarCamposComOCR";
import "../styles/FormularioMedico.css";

import {
  cadastrarFichaMedica,
  buscarFichaMedica,
  buscarImagemFichaMedica,
  atualizarFichaMedica,
} from "../services/FichaMedicaService";

import { useNavigate } from "react-router-dom";

import Nav from "../components/Nav";

const perguntas = [
  { chave: "tratamento medico", pergunta: "Está em tratamento médico?" },
  { chave: "gravida", pergunta: "Está grávida?" },
  { chave: "regime", pergunta: "Está fazendo algum regime?" },
  { chave: "diabetes", pergunta: "Possui diabetes?" },
  { chave: "alergias", pergunta: "Tem alergias?" },
  { chave: "reumatica", pergunta: "Teve febre reumática?" },
  { chave: "coagulacao", pergunta: "Tem problemas de coagulação?" },
  { chave: "cardio", pergunta: "Possui doença cárdio vascular?" },
  { chave: "hemorragicos", pergunta: "Tem problemas hemorrágicos?" },
  { chave: "anestesia", pergunta: "Já teve problemas com anestesia?" },
  { chave: "alergia a medicamento", pergunta: "Tem alergia a medicamentos?" },
  { chave: "hepatite", pergunta: "Já teve hepatite?" },
  { chave: "hiv", pergunta: "É portador do vírus HIV?" },
  { chave: "drogas", pergunta: "Usa ou já usou drogas?" },
  { chave: "fumante", pergunta: "É fumante?" },
  { chave: "fumou", pergunta: "Já fumou?" },
  {
    chave: "pressao",
    pergunta: "Como está sua pressão arterial?",
    tipo: "pressao",
  },
  { chave: "respiratorio", pergunta: "Tem problemas respiratórios?" },
];

const FormularioMedico = () => {
  const [respostas, setRespostas] = useState({});
  const [imagem, setImagem] = useState(null);
  const [textoOCR, setTextoOCR] = useState("");
  const [ocrExecutado, setOcrExecutado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [isAtualizar, setIsAtualizar] = useState(false);
  const navigate = useNavigate();
  const paciente = JSON.parse(localStorage.getItem("paciente")) || {};

  const obterFicha = async () => {
    if (!paciente.id) return;

    try {
      let ficha = await buscarFichaMedica(paciente.id);
      let response = await buscarImagemFichaMedica(paciente.id);

      ficha = ficha.data;

      if (ficha) {
        const novasRespostas = {
          "tratamento medico": ficha.tratamentoMedico ? "SIM" : "NAO",
          gravida: ficha.gravidez ? "SIM" : "NAO",
          regime: ficha.regime ? "SIM" : "NAO",
          diabetes: ficha.diabetes ? "SIM" : "NAO",
          alergias: ficha.alergias ? "SIM" : "NAO",
          reumatica: ficha.febreReumatica ? "SIM" : "NAO",
          coagulacao: ficha.coagulacao ? "SIM" : "NAO",
          cardio: ficha.doencaCardioVascular ? "SIM" : "NAO",
          hemorragicos: ficha.hemorragicos ? "SIM" : "NAO",
          anestesia: ficha.problemasAnestesia ? "SIM" : "NAO",
          "alergia a medicamento": ficha.alergiaMedicamentos ? "SIM" : "NAO",
          hepatite: ficha.hepatite ? "SIM" : "NAO",
          hiv: ficha.hiv ? "SIM" : "NAO",
          drogas: ficha.drogas ? "SIM" : "NAO",
          fumante: ficha.fumante ? "SIM" : "NAO",
          fumou: ficha.fumou ? "SIM" : "NAO",
          pressao: ficha.pressao,
          respiratorio: ficha.respiratorios ? "SIM" : "NAO",
        };

        setRespostas(novasRespostas);

        setTextoOCR(ficha.ocrTexto || "");
        setIsAtualizar(true);
      }
    } catch (error) {
      console.error("Erro ao buscar ficha:", error);
    }
  };

  useEffect(() => {
    if (paciente && paciente.id) {
      obterFicha();
    }
  }, [paciente.id]);

  const handleFileChange = (e) => {
    setImagem(e.target.files[0]);
    setOcrExecutado(false);
    setTextoOCR("");
  };

  const executarOCR = async () => {
    if (!imagem) {
      setMensagem("Carregue uma imagem primeiro.");
      return;
    }
    const texto = await ocrSpace(imagem);
    setTextoOCR(texto || "");
    setOcrExecutado(true);
    setMensagem("");
  };

  const handleAplicarOCR = () => {
    aplicarCamposComOCR(textoOCR, perguntas, setRespostas, ocrExecutado);
  };

  const handleChange = (chave, valor) => {
    setRespostas((prev) => ({ ...prev, [chave]: valor }));
  };

  const handleExtraChange = (chave, valor) => {
    setRespostas((prev) => ({ ...prev, [chave + "_extra"]: valor }));
  };

  const todosCamposPreenchidos = () => {
    return perguntas.every((item) => {
      if (item.tipo === "pressao") {
        return respostas[item.chave] && respostas[item.chave] !== "";
      }
      return respostas[item.chave] === "SIM" || respostas[item.chave] === "NAO";
    });
  };

  const handleFinalizar = async () => {
    if (!todosCamposPreenchidos()) {
      setMensagem("Preencha todos os campos antes de continuar.");
    } else {
      const formData = new FormData();

      formData.append("respostas", JSON.stringify(respostas));
      formData.append("textoOCR", textoOCR);
      formData.append("paciente", JSON.stringify());
      if (imagem instanceof File) {
        formData.append("imagem", imagem);
      }

      if (!isAtualizar) {
        const response = await cadastrarFichaMedica(formData);
        if (response.success) {
          setMensagem(response.message);
          navigate("/home");
        } else {
          setMensagem(response.message);
        }
      } else {
        const response = await atualizarFichaMedica(paciente.id, formData);
        if (response.success) {
          setMensagem("Ficha atualizada com sucesso!");
          navigate("/home");
        } else {
          setMensagem("Erro ao atualizar a ficha!");
        }
      }
    }
  };
  return (
    <div>
      <Nav />

      <div className="container mt-4">
        <div className="saude-card shadow-sm p-4 rounded bg-white">
          <h4 className="mb-4 text-center">Informações de Saúde (Anamnese)</h4>
          <form>
            <div className="mb-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="form-control"
              />
            </div>

            {imagem && (
              <div className="mt-3 text-center">
                <img
                  src={
                    typeof imagem === "string"
                      ? imagem
                      : URL.createObjectURL(imagem)
                  }
                  alt="Imagem carregada"
                  className="img-fluid"
                  style={{ maxWidth: "300px", maxHeight: "300px" }}
                />
              </div>
            )}

            <div className="mb-3 d-flex flex-column flex-sm-row gap-2">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={executarOCR}
              >
                Executar OCR
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary mt-3 profile-button w-100"
                onClick={handleAplicarOCR}
              >
                Aplicar OCR
              </button>
            </div>

            <div className="mb-3">
              <label htmlFor="textoOCR" className="form-label">
                Texto Extraído pelo OCR:
              </label>
              <textarea
                id="textoOCR"
                className="form-control"
                rows="5"
                value={textoOCR}
                readOnly
              />
            </div>

            {perguntas.map((item) => (
              <div key={item.chave} className="mb-4 border-bottom pb-3">
                <div className="row">
                  <div className="col-12 col-md-6 mb-2 mb-md-0">
                    <label className="form-label">{item.pergunta}</label>
                  </div>
                  <div className="col-12 col-md-6">
                    {item.tipo === "pressao" ? (
                      <select
                        className="form-select"
                        value={respostas.pressao || ""}
                        onChange={(e) =>
                          handleChange("pressao", e.target.value)
                        }
                      >
                        <option value="">Selecione</option>
                        <option value="NORMAL">NORMAL</option>
                        <option value="ALTA">ALTA</option>
                        <option value="BAIXA">BAIXA</option>
                      </select>
                    ) : item.tipo === "data" ? (
                      <select
                        className="form-select"
                        value={respostas[item.chave] || ""}
                        onChange={(e) =>
                          handleChange(item.chave, e.target.value)
                        }
                      >
                        <option value="">Selecione</option>
                        {/* Aqui você pode preencher dinamicamente as opções de data */}
                        {item.opcoes?.map((opcao, index) => (
                          <option key={index} value={opcao.value}>
                            {new Date(opcao.value).toLocaleDateString()}{" "}
                            {/* Formatando a data */}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="d-flex flex-wrap gap-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            id={`${item.chave}-sim`}
                            name={item.chave}
                            value="SIM"
                            checked={respostas[item.chave] === "SIM"}
                            onChange={() => handleChange(item.chave, "SIM")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`${item.chave}-sim`}
                          >
                            Sim
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            id={`${item.chave}-nao`}
                            name={item.chave}
                            value="NAO"
                            checked={respostas[item.chave] === "NAO"}
                            onChange={() => handleChange(item.chave, "NAO")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`${item.chave}-nao`}
                          >
                            Não
                          </label>
                        </div>
                      </div>
                    )}
                    {item.extra && respostas[item.chave] === "SIM" && (
                      <input
                        type="text"
                        className="form-control mt-2"
                        placeholder={item.extra}
                        value={respostas[item.chave + "_extra"] || ""}
                        onChange={(e) =>
                          handleExtraChange(item.chave, e.target.value)
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {mensagem && (
              <label className="text-danger d-block text-end mb-2">
                {mensagem}
              </label>
            )}

            <div className="text-end mt-4">
              <button
                type="button"
                className="btn btn-outline-primary px-4 w-100"
                onClick={handleFinalizar}
              >
                {isAtualizar ? "Atualizar" : "Finalizar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioMedico;
