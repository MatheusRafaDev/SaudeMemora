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
  atualizarFichaMedica,
} from "../services/FichaMedicaService";

const perguntas = [
  { 
    chave: "tratamento_medico", 
    pergunta: "Está em tratamento médico?",
    mostrarExtra: true,
    extra: "Motivo?"
  },
  { 
    chave: "gravida", 
    pergunta: "Está grávida?",
    mostrarExtra: true,
    extra: "Quantos meses?",
    dependeSexo: true
  },
  { 
    chave: "regime", 
    pergunta: "Está fazendo algum regime?",
    mostrarExtra: true,
  },
  { 
    chave: "diabetes", 
    pergunta: "Possui diabetes?",
    mostrarExtra: true,
    extra: "Tipo de diabetes?"
  },
  { 
    chave: "alergias", 
    pergunta: "Tem alergias?",
    mostrarExtra: true,
    extra: "A que?"
  },
  { 
    chave: "reumatica", 
    pergunta: "Teve febre reumática?",
    mostrarExtra: false
  },
  { 
    chave: "coagulacao", 
    pergunta: "Tem problemas de coagulação?",
    mostrarExtra: false
  },
  { 
    chave: "cardio", 
    pergunta: "Possui doença cárdio vascular?",
    mostrarExtra: true,
    extra: "Qual doença?"
  },
  { 
    chave: "hemorragicos", 
    pergunta: "Tem problemas hemorrágicos?",
    mostrarExtra: false
  },
  { 
    chave: "anestesia", 
    pergunta: "Já teve problemas com anestesia?",
    mostrarExtra: true,
    extra: "Qual problema?"
  },
  { 
    chave: "alergia_medicamento", 
    pergunta: "Tem alergia a medicamentos?",
    mostrarExtra: true,
    extra: "A qual medicamento?"
  },
  { 
    chave: "hepatite", 
    pergunta: "Já teve hepatite?",
    mostrarExtra: true,
    extra: "Há quanto tempo?"
  },
  { 
    chave: "hiv", 
    pergunta: "É portador do vírus HIV?",
    mostrarExtra: false
  },
  { 
    chave: "drogas", 
    pergunta: "Usa ou já usou drogas?",
    mostrarExtra: false
  },
  { 
    chave: "fumante", 
    pergunta: "É fumante?",
    mostrarExtra: false
  },
  { 
    chave: "fumou", 
    pergunta: "Já fumou?",
    mostrarExtra: false
  },
  {
    chave: "pressao",
    pergunta: "Como está sua pressão arterial?",
    tipo: "pressao"
  },
  { 
    chave: "respiratorio", 
    pergunta: "Tem problemas respiratórios?",
    mostrarExtra: true,
    extra: "Qual problema?"
  },
  { 
    chave: "doenca_familia", 
    pergunta: "Possui doenças na família?",
    mostrarExtra: true,
    extra: "Quais doenças?"
  }
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

  // Busca ficha médica existente
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
          doenca_familia: fichaResponse.doencaFamilia ? "SIM" : "NAO",
          // Campos extras
          ...(fichaResponse.tratamentoMedico && { tratamento_medico_extra: fichaResponse.tratamentoMedicoMotivo }),
          ...(fichaResponse.gravidez && { gravida_extra: fichaResponse.gravidezMeses }),
          ...(fichaResponse.regime && { regime_extra: fichaResponse.regimeTipo }),
          // ... outros campos extras
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
    // Define "NÃO" automaticamente para gravidez se sexo for masculino
    if (paciente.sexo && paciente.sexo.toLowerCase() === "m") {
      setRespostas(prev => ({ ...prev, gravida: "NAO" }));
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
    try {
      const texto = await ocrSpace(imagem);
      setTextoOCR(texto || "");
      setOcrExecutado(true);
      setMensagem("");
    } catch (error) {
      setMensagem("Erro ao processar OCR. Tente novamente.");
      console.error("OCR Error:", error);
    }
  };

  const handleAplicarOCR = () => {
    aplicarCamposComOCR(textoOCR, perguntas, setRespostas, ocrExecutado);
  };

  const handleChange = (chave, valor) => {
    setRespostas(prev => ({ ...prev, [chave]: valor }));
  };

  const handleExtraChange = (chave, valor) => {
    setRespostas(prev => ({ ...prev, [chave + "_extra"]: valor }));
  };

  const todosCamposPreenchidos = () => {
    return perguntas.every(item => {
      // Verifica se a pergunta deve ser exibida (considerando sexo)
      const mostrarPergunta = !(item.dependeSexo && paciente.sexo?.toLowerCase() === 'm');
      
      if (!mostrarPergunta) return true;
      
      if (item.tipo === "pressao") {
        return respostas[item.chave] && respostas[item.chave] !== "";
      }
      return respostas[item.chave] === "SIM" || respostas[item.chave] === "NAO";
    });
  };

  const handleFinalizar = async () => {
    if (!todosCamposPreenchidos()) {
      setMensagem("Preencha todos os campos antes de continuar.");
      return;
    }

    try {
      const formData = new FormData();
      const dadosFicha = {
        pacienteId: paciente.id,
        tratamentoMedico: respostas.tratamento_medico === "SIM",
        tratamentoMedicoMotivo: respostas.tratamento_medico_extra || null,
        gravidez: respostas.gravida === "SIM",
        gravidezMeses: respostas.gravida_extra || null,
        regime: respostas.regime === "SIM",
        regimeTipo: respostas.regime_extra || null,
        diabetes: respostas.diabetes === "SIM",
        diabetesTipo: respostas.diabetes_extra || null,
        alergias: respostas.alergias === "SIM",
        alergiasTipo: respostas.alergias_extra || null,
        febreReumatica: respostas.reumatica === "SIM",
        coagulacao: respostas.coagulacao === "SIM",
        doencaCardioVascular: respostas.cardio === "SIM",
        doencaCardioVascularTipo: respostas.cardio_extra || null,
        hemorragicos: respostas.hemorragicos === "SIM",
        problemasAnestesia: respostas.anestesia === "SIM",
        problemasAnestesiaTipo: respostas.anestesia_extra || null,
        alergiaMedicamentos: respostas.alergia_medicamento === "SIM",
        alergiaMedicamentosTipo: respostas.alergia_medicamento_extra || null,
        hepatite: respostas.hepatite === "SIM",
        hepatiteTempo: respostas.hepatite_extra || null,
        hiv: respostas.hiv === "SIM",
        drogas: respostas.drogas === "SIM",
        fumante: respostas.fumante === "SIM",
        fumou: respostas.fumou === "SIM",
        pressao: respostas.pressao,
        respiratorio: respostas.respiratorio === "SIM",
        respiratorioProblema: respostas.respiratorio_extra || null,
        doencaFamilia: respostas.doenca_familia === "SIM",
        doencaFamiliaTipo: respostas.doenca_familia_extra || null,
        ocrTexto: textoOCR
      };

      formData.append("dados", JSON.stringify(dadosFicha));
      if (imagem instanceof File) {
        formData.append("imagem", imagem);
      }

      let response;
      if (!isAtualizar) {
        response = await cadastrarFichaMedica(formData);
      } else {
        response = await atualizarFichaMedica(ficha.id, formData);
      }

      if (response.success) {
        setMensagem(isAtualizar ? "Ficha atualizada com sucesso!" : "Ficha cadastrada com sucesso!");
        setTimeout(() => navigate("/home"), 2000);
      } else {
        setMensagem(response.message || "Erro ao salvar ficha.");
      }
    } catch (error) {
      console.error("Erro ao salvar ficha:", error);
      setMensagem("Erro ao processar solicitação. Tente novamente.");
    }
  };

  // Renderização do formulário
  return (
    <div>
      <Nav />
      <div className="container mt-4">
        <div className="saude-card shadow-sm p-4 rounded bg-white">
          <h4 className="mb-4 text-center">Formulário Médico (Anamnese)</h4>
          
          {/* Upload de imagem e OCR */}
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
                src={typeof imagem === "string" ? imagem : URL.createObjectURL(imagem)}
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
              disabled={!imagem}
            >
              Executar OCR
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={handleAplicarOCR}
              disabled={!ocrExecutado}
            >
              Aplicar OCR
            </button>
          </div>

          {textoOCR && (
            <div className="mb-3">
              <label className="form-label">Texto Extraído pelo OCR:</label>
              <textarea
                className="form-control"
                rows="5"
                value={textoOCR}
                readOnly
              />
            </div>
          )}

          {/* Lista de perguntas */}
          {perguntas.map((item) => {
            // Oculta pergunta de gravidez se sexo for masculino
            if (item.dependeSexo && paciente.sexo?.toLowerCase() === 'm') {
              return null;
            }

            return (
              <div key={item.chave} className="mb-4 border-bottom pb-3">
                <div className="row">
                  <div className="col-12 col-md-6 mb-2 mb-md-0">
                    <label className="form-label">{item.pergunta}</label>
                  </div>
                  <div className="col-12 col-md-6">
                    {item.tipo === "pressao" ? (
                      <select
                        className="form-select"
                        value={respostas[item.chave] || ""}
                        onChange={(e) => handleChange(item.chave, e.target.value)}
                      >
                        <option value="">Selecione</option>
                        <option value="NORMAL">NORMAL</option>
                        <option value="ALTA">ALTA</option>
                        <option value="BAIXA">BAIXA</option>
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
                          <label className="form-check-label" htmlFor={`${item.chave}-sim`}>
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
                          <label className="form-check-label" htmlFor={`${item.chave}-nao`}>
                            Não
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Campo extra para perguntas específicas */}
                    {item.mostrarExtra && respostas[item.chave] === "SIM" && (
                      <input
                        type="text"
                        className="form-control mt-2"
                        placeholder={item.extra}
                        value={respostas[`${item.chave}_extra`] || ""}
                        onChange={(e) => handleExtraChange(item.chave, e.target.value)}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {mensagem && (
            <div className={`alert ${mensagem.includes("sucesso") ? "alert-success" : "alert-danger"}`}>
              {mensagem}
            </div>
          )}

          <div className="text-end mt-4">
            <button
              type="button"
              className="btn btn-primary px-4 w-100"
              onClick={handleFinalizar}
            >
              {isAtualizar ? "Atualizar Ficha" : "Salvar Ficha"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioMedico;