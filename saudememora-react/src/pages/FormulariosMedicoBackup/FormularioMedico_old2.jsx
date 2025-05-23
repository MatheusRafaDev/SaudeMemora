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
import { perguntas } from "../data/perguntasMedicas"; // Assume this contains your questions array

const FormularioMedico = () => {
  const [respostas, setRespostas] = useState({});
  const [imagem, setImagem] = useState(null);
  const [textoOCR, setTextoOCR] = useState("");
  const [ocrExecutado, setOcrExecutado] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  const [isAtualizar, setIsAtualizar] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const paciente = JSON.parse(localStorage.getItem("paciente")) || {};
  const [ficha, setFicha] = useState(null);

  useEffect(() => {
    const carregarFichaExistente = async () => {
      if (!paciente.id) return;

      try {
        setCarregando(true);
        const response = await buscarFichaMedica(paciente.id);
        
        if (response.success && response.data) {
          const fichaResponse = response.data;
          setFicha(fichaResponse);
          preencherRespostas(fichaResponse);
          setTextoOCR(fichaResponse.ocrTexto || "");
          setIsAtualizar(true);
        }
      } catch (error) {
        mostrarMensagem("Erro ao carregar ficha médica existente", "erro");
        console.error("Erro ao buscar ficha:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarFichaExistente();
  }, [paciente.id]);

  const preencherRespostas = (fichaResponse) => {
    const novasRespostas = {};
    
    perguntas.forEach(item => {
      const valorBooleano = fichaResponse[item.chave];
      novasRespostas[item.chave] = valorBooleano ? "SIM" : "NAO";
      
      if (item.mostrarExtra && valorBooleano) {
        novasRespostas[`${item.chave}_extra`] = fichaResponse[`${item.chave}Extra`] || "";
      }
    });
    
    // Campos especiais
    novasRespostas.pressao = fichaResponse.pressao || "";
    
    setRespostas(novasRespostas);
  };

  const mostrarMensagem = (texto, tipo = "sucesso") => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem({ texto: "", tipo: "" }), 5000);
  };

  const handleFileChange = (e) => {
    const arquivo = e.target.files[0];
    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      mostrarMensagem("Por favor, selecione uma imagem válida", "erro");
      return;
    }

    setImagem(arquivo);
    setOcrExecutado(false);
    setTextoOCR("");
  };

  const executarOCR = async () => {
    if (!imagem) {
      mostrarMensagem("Carregue uma imagem primeiro", "erro");
      return;
    }

    try {
      setCarregando(true);
      const texto = await ocrSpace(imagem);
      setTextoOCR(texto || "");
      setOcrExecutado(true);
      mostrarMensagem("OCR executado com sucesso!", "sucesso");
    } catch (error) {
      mostrarMensagem("Erro ao processar OCR. Tente novamente.", "erro");
      console.error("OCR Error:", error);
    } finally {
      setCarregando(false);
    }
  };

  const handleAplicarOCR = () => {
    if (!ocrExecutado) {
      mostrarMensagem("Execute o OCR primeiro", "erro");
      return;
    }
    
    aplicarCamposComOCR(textoOCR, perguntas, setRespostas);
    mostrarMensagem("Campos preenchidos com sucesso!", "sucesso");
  };

  const handleChange = (chave, valor) => {
    setRespostas(prev => {
      const newRespostas = { ...prev, [chave]: valor };

      if (valor === "NAO") {
        const question = perguntas.find(q => q.chave === chave);
        if (question?.mostrarExtra) {
          newRespostas[`${chave}_extra`] = "";
        }
      }

      return newRespostas;
    });
  };

  const handleExtraChange = (chave, valor) => {
    setRespostas(prev => ({ ...prev, [`${chave}_extra`]: valor }));
  };

  const validarFormulario = () => {
    for (const item of perguntas) {
      const resposta = respostas[item.chave];
      
      if (!resposta || (item.tipo !== "pressao" && !["SIM", "NAO"].includes(resposta))) {
        return false;
      }

      if (resposta === "SIM" && item.mostrarExtra && !respostas[`${item.chave}_extra`]?.trim()) {
        return false;
      }

      if (item.tipo === "pressao" && !resposta.trim()) {
        return false;
      }
    }
    
    return true;
  };

  const handleFinalizar = async () => {
    if (!validarFormulario()) {
      mostrarMensagem("Preencha todos os campos obrigatórios", "erro");
      return;
    }

    try {
      setCarregando(true);
      const formData = new FormData();
      formData.append("respostas", JSON.stringify(respostas));
      formData.append("textoOCR", textoOCR);
      formData.append("paciente", JSON.stringify(paciente));
      
      if (imagem instanceof File) {
        formData.append("imagem", imagem);
      }

      const response = isAtualizar
        ? await atualizarFichaMedica(ficha.id, formData)
        : await cadastrarFichaMedica(formData);

      if (response.success) {
        mostrarMensagem(
          `Ficha ${isAtualizar ? "atualizada" : "cadastrada"} com sucesso!`,
          "sucesso"
        );
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        mostrarMensagem(response.message || "Erro ao processar a ficha", "erro");
      }
    } catch (error) {
      console.error("Erro ao salvar ficha:", error);
      mostrarMensagem("Erro ao salvar a ficha. Tente novamente.", "erro");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="formulario-medico">
      <Nav />
      
      <div className="container py-4">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-primary text-white py-3">
            <h2 className="h4 mb-0 text-center">
              <i className="bi bi-clipboard2-pulse me-2"></i>
              Formulário Médico
            </h2>
          </div>
          
          <div className="card-body p-4">
            {/* Seção de Upload */}
            <div className="upload-section mb-4 p-3 bg-light rounded">
              <h5 className="mb-3 text-primary">
                <i className="bi bi-cloud-arrow-up me-2"></i>
                Digitalização da Ficha
              </h5>
              
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Selecione a imagem da ficha médica
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="form-control"
                    disabled={carregando}
                  />
                </div>
                
                <div className="col-md-6 d-flex align-items-end gap-2">
                  <button
                    type="button"
                    className="btn btn-primary flex-grow-1"
                    onClick={executarOCR}
                    disabled={!imagem || carregando}
                  >
                    {carregando ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    ) : (
                      <i className="bi bi-eye me-2"></i>
                    )}
                    Executar OCR
                  </button>
                  <button
                    type="button"
                    className="btn btn-success flex-grow-1"
                    onClick={handleAplicarOCR}
                    disabled={!ocrExecutado || carregando}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Aplicar OCR
                  </button>
                </div>
              </div>
              
              {imagem && (
                <div className="mt-3 text-center">
                  <img
                    src={typeof imagem === "string" ? imagem : URL.createObjectURL(imagem)}
                    alt="Preview"
                    className="img-thumbnail"
                    style={{ maxHeight: "200px" }}
                  />
                </div>
              )}
            </div>
            
            {/* Resultado do OCR */}
            <div className="ocr-result mb-4 p-3 bg-light rounded">
              <label className="form-label fw-semibold">
                <i className="bi bi-text-paragraph me-2"></i>
                Texto Extraído
              </label>
              <textarea
                className="form-control font-monospace"
                rows="4"
                value={textoOCR}
                readOnly
                placeholder="O texto reconhecido aparecerá aqui..."
              />
            </div>
            
            {/* Formulário de Perguntas */}
            <div className="questionario">
              <h5 className="mb-3 text-primary">
                <i className="bi bi-question-circle me-2"></i>
                Questionário de Saúde
              </h5>
              
              {perguntas.map((item) => {
                if (item.dependeSexo && paciente.sexo?.toLowerCase() === "m") {
                  return null;
                }
                
                return (
                  <div key={item.chave} className="pergunta mb-3 p-3 border rounded bg-white">
                    <div className="row align-items-center">
                      <div className="col-lg-5 mb-2 mb-lg-0">
                        <label className="form-label fw-semibold">
                          {item.pergunta}
                        </label>
                      </div>
                      
                      <div className="col-lg-7">
                        {item.tipo === "pressao" ? (
                          <select
                            className="form-select"
                            value={respostas[item.chave] || ""}
                            onChange={(e) => handleChange(item.chave, e.target.value)}
                            disabled={carregando}
                            required
                          >
                            <option value="">Selecione...</option>
                            <option value="NORMAL">Normal</option>
                            <option value="ALTA">Alta</option>
                            <option value="BAIXA">Baixa</option>
                          </select>
                        ) : (
                          <div className="d-flex flex-column gap-2">
                            <div className="d-flex align-items-center gap-3">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  id={`${item.chave}-sim`}
                                  name={item.chave}
                                  value="SIM"
                                  checked={respostas[item.chave] === "SIM"}
                                  onChange={() => handleChange(item.chave, "SIM")}
                                  disabled={carregando}
                                  required
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
                                  disabled={carregando}
                                  required
                                />
                                <label className="form-check-label" htmlFor={`${item.chave}-nao`}>
                                  Não
                                </label>
                              </div>
                            </div>
                            
                            {item.mostrarExtra && respostas[item.chave] === "SIM" && (
                              <div className="mt-2">
                                <div className="input-group">
                                  <span className="input-group-text bg-light">
                                    {item.extra}
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={respostas[`${item.chave}_extra`] || ""}
                                    onChange={(e) => handleExtraChange(item.chave, e.target.value)}
                                    disabled={carregando}
                                    required={respostas[item.chave] === "SIM"}
                                    placeholder={`Informe ${item.extra.toLowerCase()}`}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Mensagens de feedback */}
            {mensagem.texto && (
              <div className={`alert alert-${mensagem.tipo === "erro" ? "danger" : "success"} mt-4`}>
                <div className="d-flex justify-content-between align-items-center">
                  <span>
                    <i className={`bi ${mensagem.tipo === "erro" ? "bi-exclamation-triangle" : "bi-check-circle"} me-2`}></i>
                    {mensagem.texto}
                  </span>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMensagem({ texto: "", tipo: "" })}
                  ></button>
                </div>
              </div>
            )}
            
            {/* Botão de envio */}
            <div className="d-grid mt-4">
              <button
                type="button"
                className="btn btn-primary btn-lg py-2"
                onClick={handleFinalizar}
                disabled={carregando}
              >
                {carregando ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Processando...
                  </>
                ) : (
                  <>
                    <i className={`bi ${isAtualizar ? "bi-arrow-repeat" : "bi-save"} me-2`}></i>
                    {isAtualizar ? "Atualizar Ficha" : "Salvar Ficha"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioMedico;