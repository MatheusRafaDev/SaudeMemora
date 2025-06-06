import React, { useState, useEffect, useCallback } from "react";
import { FiUpload, FiCamera, FiFileText, FiCheckCircle } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/UploadDocumento.css";

import { ocrSpace, ocrSpace2 } from "../ocr/ocrSpace";
import { formatarTextoOCR } from "../services/OpenRouter";
import { useNavigate } from "react-router-dom";
import { AdicionarDocumento } from "../documentos/AdicionarDocumento";
import { extrairMedicamentosDoOCR } from "../services/OpenRouter";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function UploadDocumentos() {
  const [documento, setDocumento] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("Aguardando envio...");
  const [progresso, setProgresso] = useState(0);
  const [textoOCR, setTextoOCR] = useState("");
  const [textoExibicao, setTextoExibicao] = useState("");
  const [botaoHabilitado, setBotaoHabilitado] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [mensagemErro, setMensagemErro] = useState("");
  const [processando, setProcessando] = useState(false);
  const [adicionandoDocumento, setAdicionandoDocumento] = useState(false);
  const [remedios, setRemedios] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const [formasDeUso, setFormasDeUso] = useState({});
  const [errosQuantidade, setErrosQuantidade] = useState({});
  const navigate = useNavigate();

  // Carrega paciente do localStorage e faz cleanup da URL de preview
  useEffect(() => {
    const pacienteData = JSON.parse(localStorage.getItem("paciente")) || {};
    setPaciente(pacienteData);

    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Revogar URL anterior se existir
      if (preview) URL.revokeObjectURL(preview);

      setDocumento(file);
      setPreview(URL.createObjectURL(file));
      setStatus("Arquivo selecionado. Pronto para envio.");
      setProgresso(0);
      setTextoOCR("");
      setTextoExibicao("");
      setBotaoHabilitado(false);
      setMensagemErro("");
      setRemedios([]);
      setQuantidades({});
      setFormasDeUso({});
      setErrosQuantidade({});
    }
  };

  const handleCameraClick = () => {
    document.getElementById("cameraInput").click();
  };

  const resetState = useCallback(
    (initialStatus = "Aguardando envio...") => {
      if (preview) URL.revokeObjectURL(preview);
      setStatus(initialStatus);
      setProgresso(0);
      setTextoOCR("");
      setTextoExibicao("");
      setRemedios([]);
      setMedicamentos([]);
      setQuantidades({});
      setFormasDeUso({});
      setErrosQuantidade({});
      setBotaoHabilitado(false);
      setMensagemErro("");
      setTipoDocumento("");
      setDocumento(null);
      setPreview(null);
    },
    [preview]
  );

  const handleQuantidadeChange = (remedio, valor) => {
    const erro = !valor.trim()
      ? "Quantidade é obrigatória"
      : !/^\d+(\s*\w*)?$/.test(valor)
      ? "Formato inválido (ex: 30 comprimidos)"
      : "";

    setErrosQuantidade((prev) => ({ ...prev, [remedio]: erro }));
    setQuantidades((prev) => ({ ...prev, [remedio]: valor }));
  };

  const handleFormaUsoChange = (remedio, valor) => {
    setFormasDeUso((prev) => ({ ...prev, [remedio]: valor }));
  };

  const handleUpload = async () => {
    if (!documento) {
      setMensagemErro("Selecione ou tire uma foto do documento.");
      return;
    }

    if (!tipoDocumento) {
      setMensagemErro("Selecione o tipo de documento antes de processar.");
      return;
    }

    if (processando) return;

    setProcessando(true);
    setStatus("Enviando...");
    setProgresso(0);
    setMensagemErro("");

    const intervalo = setInterval(() => {
      setProgresso((prev) => {
        if (prev >= 90) clearInterval(intervalo);
        return Math.min(prev + 10, 90);
      });
    }, 200);

    try {
      const [textoOriginal, textoOriginal2] = await Promise.all([
        ocrSpace(documento),
        ocrSpace2(documento),
      ]);

      setTextoOCR(textoOriginal);

      const formatado = await formatarTextoOCR(textoOriginal, textoOriginal2);
      setTextoExibicao(formatado);

      if (tipoDocumento === "R") {
        const medicamentosExtraidos = await extrairMedicamentosDoOCR(formatado);
        if (
          !Array.isArray(medicamentosExtraidos) ||
          medicamentosExtraidos.length === 0
        ) {
          throw new Error("Nenhum medicamento encontrado no documento");
        }

        setMedicamentos(medicamentosExtraidos);
        setRemedios(medicamentosExtraidos.map((m) => m.nome));

        const inicialQuantidades = {};
        const inicialFormas = {};
        medicamentosExtraidos.forEach((med) => {
          inicialQuantidades[med.nome] = med.quantidade || "";
          inicialFormas[med.nome] = med.formaDeUso || "";
        });
        setQuantidades(inicialQuantidades);
        setFormasDeUso(inicialFormas);
      } else {
        setMedicamentos([]);
        setRemedios([]);
        setQuantidades({});
        setFormasDeUso({});
      }

      clearInterval(intervalo);
      setProgresso(100);
      setStatus("Documento processado com sucesso!");
      setBotaoHabilitado(true);
    } catch (erro) {
      console.error("Erro no processamento:", erro);
      clearInterval(intervalo);
      setProgresso(0);
      setStatus("Erro ao processar o documento.");
      setTextoExibicao(erro.message || "Erro no processamento do documento");
      setBotaoHabilitado(false);
      setMensagemErro(erro.message || "Erro ao processar o documento");
      resetState("Erro ao processar. Tente novamente.");
    } finally {
      setProcessando(false);
    }
  };

  const handleAddDocument = async () => {
    if (adicionandoDocumento) return;

    if (!textoOCR) {
      setMensagemErro("Nenhum texto processado para adicionar.");
      return;
    }

    if (!tipoDocumento) {
      setMensagemErro("Selecione o tipo de documento.");
      return;
    }

    if (!paciente || !paciente.id) {
      setMensagemErro("Nenhum paciente selecionado.");
      return;
    }

    if (!documento) {
      setMensagemErro("Nenhuma imagem do documento foi enviada.");
      return;
    }

    // Validação de medicamentos para receitas
    if (tipoDocumento === "R") {
      for (const remedio of remedios) {
        if (!quantidades[remedio] || !quantidades[remedio].trim()) {
          setMensagemErro(
            `Informe a quantidade válida para o remédio: ${remedio}`
          );
          setErrosQuantidade((prev) => ({
            ...prev,
            [remedio]: "Quantidade é obrigatória",
          }));
          return;
        }
      }
    }

    const medicamentosAtualizados = medicamentos.map((med) => ({
      ...med,
      quantidade: quantidades[med.nome] || med.quantidade,
      formaDeUso: formasDeUso[med.nome] || med.formaDeUso,
    }));

    setAdicionandoDocumento(true);
    setStatus("Adicionando documento...");

    try {
      const response = await AdicionarDocumento(
        tipoDocumento,
        textoExibicao,
        paciente,
        documento,
        navigate,
        medicamentosAtualizados
      );

      if (response.success) {
        resetState("Documento adicionado com sucesso!");
      } else {
        setMensagemErro(response.message || "Erro ao adicionar documento");
      }
    } catch (error) {
      console.error("Erro ao adicionar documento:", error);
      setMensagemErro(error.message || "Erro ao adicionar o documento");
    } finally {
      setAdicionandoDocumento(false);
    }
  };

  return (
    <div>
      <div className="container upload-container mt-4">
        <h4 className="text-center mb-3">
          <FiUpload /> Processamento de Documento
        </h4>

        <div className="alert alert-info mt-3" role="alert">
          📷 Para melhores resultados, tire fotos com boa qualidade. Imagens
          borradas ou escuras podem dificultar o reconhecimento do texto.
        </div>

        {preview && (
          <div
            className="d-flex justify-content-center mb-3"
            style={{ height: "400px" }}
          >
            <TransformWrapper
              initialScale={1}
              minScale={1}
              maxScale={5}
              wheel={{ step: 0.1 }}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <div
                    className="tools"
                    style={{
                      position: "absolute",
                      zIndex: 10,
                      top: "10px",
                      left: "10px",
                    }}
                  ></div>
                  <TransformComponent
                    wrapperStyle={{
                      width: "100%",
                      height: "100%",
                    }}
                    contentStyle={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={preview}
                      alt="Pré-visualização"
                      className="img-fluid rounded shadow"
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                        cursor: "grab",
                      }}
                    />
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </div>
        )}

        <div className="form-group mt-3">
          <label htmlFor="tipoDocumento">
            <strong>Tipo de Documento:</strong>
          </label>
          <select
            id="tipoDocumento"
            className={`form-control ${
              !tipoDocumento && mensagemErro.includes("tipo de documento")
                ? "is-invalid"
                : ""
            }`}
            value={tipoDocumento}
            onChange={(e) => setTipoDocumento(e.target.value)}
            disabled={processando || adicionandoDocumento}
          >
            <option value="">Selecione o tipo</option>
            <option value="E">Exame</option>
            <option value="R">Receita</option>
            <option value="D">Documento Clínico</option>
          </select>
        </div>

        <div className="button-group mt-3">
          <button
            className="btn btn-secondary"
            onClick={handleCameraClick}
            disabled={processando || adicionandoDocumento}
          >
            <FiCamera /> Tirar Foto
          </button>

          <label
            className={`btn btn-secondary ${
              processando || adicionandoDocumento ? "disabled" : ""
            }`}
          >
            <FiFileText /> Escolher Arquivo
            <input
              id="cameraInput"
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              hidden
              disabled={processando || adicionandoDocumento}
            />
          </label>

          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!documento || processando || adicionandoDocumento}
          >
            {processando ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Processando...
              </>
            ) : (
              "🚀 Processar Documento"
            )}
          </button>
        </div>

        {progresso > 0 && (
          <div className="progress mt-3">
            <div
              className="progress-bar progress-bar-striped bg-success"
              style={{ width: `${progresso}%` }}
            />
          </div>
        )}

        <div className="mt-3">
          <strong>Status:</strong>{" "}
          {status.includes("sucesso") ? (
            <span className="text-success">
              <FiCheckCircle /> {status}
            </span>
          ) : (
            status
          )}
        </div>

        {mensagemErro && (
          <div className="alert alert-danger mt-3" role="alert">
            {mensagemErro}
          </div>
        )}

        {textoExibicao && (
          <div className="mt-4">
            <h5 className="mb-2">Texto extraído do documento:</h5>
            <textarea
              className="form-control"
              rows="10"
              value={textoExibicao}
              onChange={(e) => setTextoExibicao(e.target.value)}
              style={{ whiteSpace: "pre-wrap" }}
              disabled={adicionandoDocumento}
            />
          </div>
        )}

        {tipoDocumento === "R" && medicamentos.length > 0 && (
          <div className="mt-4">
            <h5>Medicamentos encontrados:</h5>

            <table className="table table-bordered table-striped table-hover">
              <thead>
                <tr>
                  <th colSpan="3">Medicamento</th>
                </tr>
              </thead>
              <tbody>
                {medicamentos.map((medicamento, index) => (
                  <React.Fragment key={`med-${index}`}>
                    <tr>
                      <td
                        colSpan="3"
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        {medicamento.nome}
                      </td>
                    </tr>

                    <tr>
                      <td>Quantidade:</td>
                      <td>
                        <input
                          type="text"
                          className={`form-control ${
                            errosQuantidade[medicamento.nome]
                              ? "is-invalid"
                              : ""
                          }`}
                          value={quantidades[medicamento.nome] || ""}
                          onChange={(e) =>
                            handleQuantidadeChange(
                              medicamento.nome,
                              e.target.value
                            )
                          }
                          disabled={adicionandoDocumento}
                        />
                        {errosQuantidade[medicamento.nome] && (
                          <div className="invalid-feedback">
                            {errosQuantidade[medicamento.nome]}
                          </div>
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td>Forma de Uso:</td>
                      <td colSpan="2">
                        <input
                          type="text"
                          className="form-control"
                          value={formasDeUso[medicamento.nome] || ""}
                          onChange={(e) =>
                            handleFormaUsoChange(
                              medicamento.nome,
                              e.target.value
                            )
                          }
                          placeholder="Ex: 1 comprimido a cada 8 horas"
                          disabled={adicionandoDocumento}
                        />
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            <div className="alert alert-warning mt-3" role="alert">
              ⚠️ <strong>Atenção:</strong> Certifique-se de que a{" "}
              <strong>quantidade</strong> e a{" "}
              <strong>forma de uso dos medicamentos</strong> estejam corretas no
              documento enviado.
            </div>
          </div>
        )}

        <div className="mt-3">
          <button
            className="btn btn-secondary w-100"
            onClick={handleAddDocument}
            disabled={!botaoHabilitado || adicionandoDocumento}
          >
            {adicionandoDocumento ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Salvando...
              </>
            ) : (
              "💾 Salvar Documento"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
