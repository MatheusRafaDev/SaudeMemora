import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ocrSpace } from "../ocr/ocrSpace";
import { aplicarCamposComOCR } from "../ocr/aplicarCamposComOCR";
import "../styles/FormularioMedico.css";
import Nav from "../components/Nav";
import { useNavigate } from "react-router-dom";
import {
  cadastrarFichaMedica,
  buscarFichaMedica,
  buscarImagemFichaMedica,
  atualizarFichaMedica,
} from "../services/FichaMedicaService";

const perguntas = [
  { chave: "tratamento_medico", pergunta: "Está em tratamento médico?" },
  { chave: "gravida", pergunta: "Está grávida?" },
  { chave: "regime", pergunta: "Está fazendo algum regime?" },
  { chave: "diabetes", pergunta: "Possui diabetes?" },
  { chave: "alergias", pergunta: "Tem alergias?" },
  { chave: "reumatica", pergunta: "Teve febre reumática?" },
  { chave: "coagulacao", pergunta: "Tem problemas de coagulação?" },
  { chave: "cardio", pergunta: "Possui doença cárdio vascular?" },
  { chave: "hemorragicos", pergunta: "Tem problemas hemorrágicos?" },
  { chave: "anestesia", pergunta: "Já teve problemas com anestesia?" },
  { chave: "alergia_medicamento", pergunta: "Tem alergia a medicamentos?" },
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
  const [ficha, setFicha] = useState(null);

  const obterFicha = async () => {
  if (!paciente.id) return;

  try {
    let fichaResponse = await buscarFichaMedica(paciente.id); 
    fichaResponse = fichaResponse.data;

    if (fichaResponse) {
      setFicha(fichaResponse); 
      const novasRespostas = {
        tratamento_medico: fichaResponse.tratamentoMedico ? "SIM" : "NAO",
        gravida: fichaResponse.gravidez ? "SIM" : "NAO",
        regime: fichaResponse.regime ? "SIM" : "NAO",
        diabetes: fichaResponse.diabetes ? "SIM" : "NAO",
        alergias: fichaResponse.alergias ? "SIM" : "NAO",
        reumatica: fichaResponse.febreReumatica ? "SIM" : "NAO",
        coagulacao: fichaResponse.coagulacao ? "SIM" : "NAO",
        cardio: fichaResponse.doencaCardioVascular ? "SIM" : "NAO",
        hemorragicos: fichaResponse.hemorragicos ? "SIM" : "NAO",
        anestesia: fichaResponse.problemasAnestesia ? "SIM" : "NAO",
        alergia_medicamento: fichaResponse.alergiaMedicamentos ? "SIM" : "NAO",
        hepatite: fichaResponse.hepatite ? "SIM" : "NAO",
        hiv: fichaResponse.hiv ? "SIM" : "NAO",
        drogas: fichaResponse.drogas ? "SIM" : "NAO",
        fumante: fichaResponse.fumante ? "SIM" : "NAO",
        fumou: fichaResponse.fumou ? "SIM" : "NAO",
        pressao: fichaResponse.pressao,
        respiratorio: fichaResponse.respiratorio ? "SIM" : "NAO",
      };

      setRespostas(novasRespostas);
      setTextoOCR(fichaResponse.ocrTexto || "");
      setIsAtualizar(true);
    }
  } catch (error) {
    console.error("Erro ao buscar ficha:", error);
  }
};

  useEffect(() => {
     if (paciente.sexo && paciente.sexo.toLowerCase() === "m") {
    setRespostas((prev) => ({ ...prev, gravida: "NAO" }));
  }

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
    if (!imagem.type.startsWith("image/")) {
      setMensagem("Por favor, selecione uma imagem válida.");
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
      formData.append("paciente", JSON.stringify(paciente));
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

        const response = await atualizarFichaMedica(ficha.id, formData);
        if (response.success) {
          setMensagem("Ficha atualizada com sucesso!");
           navigate("/formulario-medico");
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
          <h4 className="mb-4 text-center">Formulário Médico (Anamnese)</h4>
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
                disabled={!ocrExecutado}
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
                        {item.opcoes?.map((opcao, index) => (
                          <option key={index} value={opcao.value}>
                            {new Date(opcao.value).toLocaleDateString()} 
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
