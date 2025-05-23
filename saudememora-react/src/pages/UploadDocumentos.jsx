import React, { useState, useEffect } from "react";
import { FiUpload, FiCamera, FiFileText, FiCheckCircle } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/UploadDocumento.css";
import Nav from "../components/Nav";
import { ocrSpace } from "../ocr/ocrSpace";
import { formatarTextoOCR } from "../services/OpenRouter";
import { useNavigate } from "react-router-dom";
import { AdicionarDocumento } from "../documentos/AdicionarDocumento";
import { extrairMedicamentosDoOCR } from "../services/OpenRouter";

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
  const navigate = useNavigate();

  useEffect(() => {
    const pacienteData = JSON.parse(localStorage.getItem("paciente")) || {};
    setPaciente(pacienteData);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
    }
  };

  const handleCameraClick = () => {
    document.getElementById("cameraInput").click();
  };

  const handleUpload = async () => {
    if (!documento) {
      setMensagemErro("Selecione ou tire uma foto do documento.");
      return;
    }

    if (processando) return;

    setProcessando(true);
    setStatus("Enviando...");
    setProgresso(0);

    const intervalo = setInterval(() => {
      setProgresso((prev) => {
        if (prev >= 90) clearInterval(intervalo);
        return Math.min(prev + 10, 90);
      });
    }, 200);

    try {
      const textoOriginal = await ocrSpace(documento);
      setTextoOCR(textoOriginal);

      const formatado = await formatarTextoOCR(textoOriginal);
      setTextoExibicao(formatado);

      const medicamentos = await extrairMedicamentosDoOCR(formatado);

      if (tipoDocumento === "R") {
        if (!Array.isArray(medicamentos) || medicamentos.length === 0) {
          console.error(
            "Erro ao extrair medicamentos: Nenhum medicamento encontrado"
          );
          setRemedios([]);
          setQuantidades({});
          setFormasDeUso({});
          return;
        }

        setMedicamentos(medicamentos);
        setRemedios(medicamentos.map((m) => m.nome));

        const inicialQuantidades = {};
        const inicialFormas = {};
        medicamentos.forEach((med) => {
          inicialQuantidades[med.nome] = "";
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
      setMensagemErro("");
    } catch (erro) {
      clearInterval(intervalo);
      setProgresso(0);
      setStatus("Erro ao processar o documento.");
      setTextoExibicao("Erro no processamento: " + erro.message);
      setBotaoHabilitado(false);
      setMensagemErro("Erro ao processar o documento: " + erro.message);
      setRemedios([]);
      setQuantidades({});
      setFormasDeUso({});
    } finally {
      setProcessando(false);
    }
  };

  const handleQuantidadeChange = (remedio, valor) => {
    setQuantidades((prev) => ({ ...prev, [remedio]: valor }));
  };

  const handleFormaUsoChange = (remedio, valor) => {
    setFormasDeUso((prev) => ({ ...prev, [remedio]: valor }));
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
      setMensagemErro("Nenhum paciente encontrado. Verifique o localStorage.");
      return;
    }

    if (!documento) {
      setMensagemErro("Nenhuma imagem do documento foi enviada.");
      return;
    }

    // Valida as quantidades dos remédios
    for (const remedio of remedios) {
      if (!quantidades[remedio] || isNaN(quantidades[remedio])) {
        setMensagemErro(`Informe a quantidade do remédio: ${remedio}`);
        return;
      }
    }

    setAdicionandoDocumento(true);
    setStatus("Adicionando documento...");

    try {
      // Passa também as formasDeUso para salvar se necessário
      const response = await AdicionarDocumento(
        tipoDocumento,
        textoOCR,
        paciente,
        documento,
        navigate,
        { medicamentos, quantidades, formasDeUso } // Pode ajustar conforme sua API
      );

      if (response.success) {
        setMensagemErro("");
        setDocumento(null);
        setPreview(null);
        resetState("Documento adicionado com sucesso!");
      } else {
        setMensagemErro(response.message);
      }
    } catch (error) {
      setMensagemErro("Erro ao adicionar o documento: " + error.message);
    } finally {
      setAdicionandoDocumento(false);
    }
  };

  const resetState = (initialStatus) => {
    setStatus(initialStatus);
    setProgresso(0);
    setTextoOCR("");
    setTextoExibicao("");
    setRemedios([]);
    setQuantidades({});
    setFormasDeUso({});
    setBotaoHabilitado(false);
    setMensagemErro("");
  };

  return (
    <div>
      <Nav />
      <div className="container upload-container mt-4">
        <h4 className="text-center mb-3">
          <FiUpload /> Processamento de Documento
        </h4>

        <div className="alert alert-info mt-3" role="alert">
          🔍 Para melhores resultados, recomendamos fazer um{" "}
          <strong>escaneamento do documento</strong> antes de enviá-lo. Fotos
          com baixa qualidade podem prejudicar o reconhecimento do texto.
        </div>

        {preview && (
          <div className="preview-container mb-3 text-center">
            <img
              src={preview}
              alt="Pré-visualização"
              className="img-fluid rounded shadow"
            />
          </div>
        )}

        <div className="form-group mt-3">
          <label htmlFor="tipoDocumento">
            <strong>Tipo de Documento:</strong>
          </label>
          <select
            id="tipoDocumento"
            className="form-control"
            value={tipoDocumento}
            onChange={(e) => setTipoDocumento(e.target.value)}
            disabled={processando || adicionandoDocumento}
          >
            <option value="">Selecione o tipo</option>
            <option value="E">Exame</option>
            <option value="R">Receitas</option>
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
              accept="image/*"
              capture="environment"
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
            <h5>Texto extraído do documento:</h5>
            <pre
              className="bg-light p-3 rounded"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {textoExibicao}
            </pre>
          </div>
        )}

        {tipoDocumento === "R" && medicamentos.length > 0 && (
          <div className="mt-4">
            <h5>Medicamentos encontrados:</h5>
            <table className="table table-bordered table-striped table-hover">
              <thead>
                <tr>
                  <th>Medicamento</th>
                  <th>Quantidade</th>
                  <th>Forma de Uso</th>
                </tr>
              </thead>
              <tbody>
                {medicamentos.map((medicamento, index) => (
                  <tr key={index}>
                    <td>{medicamento.nome}</td>
                    <td>
                      <input
                        type="text"
                        min="0"
                        className="form-control"
                        value={quantidades[medicamento.nome] || ""}
                        onChange={(e) =>
                          handleQuantidadeChange(
                            medicamento.nome,
                            e.target.value
                          )
                        }
                        disabled={adicionandoDocumento}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={formasDeUso[medicamento.nome] || ""}
                        onChange={(e) =>
                          handleFormaUsoChange(medicamento.nome, e.target.value)
                        }
                        placeholder="Informe a forma de uso"
                        disabled={adicionandoDocumento}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
