import React, { useState, useEffect } from "react";
import { FiUpload, FiCamera, FiFileText, FiCheckCircle } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/UploadDocumento.css";
import Nav from "../components/Nav";
import { ocrSpace } from "../ocr/ocrSpace";
import { useNavigate } from "react-router-dom";
import { AdicionarDocumento } from "../documentos/AdicionarDocumento";

export default function UploadDocumentos() {
  const [documento, setDocumento] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("Aguardando envio...");
  const [progresso, setProgresso] = useState(0);
  const [resultadoProcessamento, setResultadoProcessamento] = useState("");
  const [botaoHabilitado, setBotaoHabilitado] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [mensagemErro, setMensagemErro] = useState("");
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
      setResultadoProcessamento("");
      setBotaoHabilitado(false);
      setMensagemErro("");
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

    setStatus("Enviando...");
    setProgresso(0);

    const intervalo = setInterval(() => {
      setProgresso((prev) => {
        if (prev >= 90) clearInterval(intervalo);
        return Math.min(prev + 10, 90);
      });
    }, 200);

    try {
      const textoExtraido = await ocrSpace(documento);
      clearInterval(intervalo);
      setProgresso(100);
      setStatus("Documento enviado e em processamento.");
      setResultadoProcessamento(textoExtraido || "Nenhum texto reconhecido.");
      setBotaoHabilitado(true);
      setMensagemErro("");
    } catch (erro) {
      clearInterval(intervalo);
      setProgresso(0);
      setStatus("Erro ao processar o documento.");
      setResultadoProcessamento("Erro: " + erro.message);
      setBotaoHabilitado(false);
      setMensagemErro("Erro ao processar o documento: " + erro.message);
    }
  };

  const handleAddDocument = async () => {
    try {
      if (!resultadoProcessamento) {
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

      const response = await AdicionarDocumento(
        tipoDocumento,
        resultadoProcessamento,
        paciente,
        documento,
        navigate
      );

      if (response.success) {
        setMensagemErro("");
        setDocumento(null);
        setPreview(null);
        resetState("Aguardando envio...");
      } else {
        setMensagemErro(response.message);
      }
    } catch (error) {
      setMensagemErro("Erro ao adicionar o documento: " + error.message);
    }
  };

  const resetState = (initialStatus) => {
    setStatus(initialStatus);
    setProgresso(0);
    setResultadoProcessamento("");
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
          >
            <option value="">Selecione o tipo</option>
            <option value="E">Exame</option>
            <option value="P">Prontuário</option>
            <option value="R">Receitas</option>
          </select>
        </div>

        <div className="button-group mt-3">
          <button className="btn btn-secondary" onClick={handleCameraClick}>
            <FiCamera /> Tirar Foto
          </button>

          <label className="btn btn-secondary">
            <FiFileText /> Escolher Arquivo
            <input
              id="cameraInput"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              hidden
            />
          </label>

          <button className="btn btn-primary" onClick={handleUpload}>
            🚀 Processar Documento
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
          {status === "Documento enviado e em processamento." ? (
            <span className="text-success">
              <FiCheckCircle /> {status}
            </span>
          ) : (
            status
          )}
        </div>

        <div className="mt-4">
          <strong>Resultado do Processamento:</strong>
          <textarea
            className="form-control"
            rows="4"
            value={resultadoProcessamento}
            readOnly
          />
        </div>

        <div className="mt-3">
          <button
            className="btn btn-secondary w-100"
            onClick={handleAddDocument}
            disabled={!botaoHabilitado}
          >
            📄 Adicionar Documento
          </button>
        </div>

        {mensagemErro && (
          <div className="alert alert-danger mt-3" role="alert">
            {mensagemErro}
          </div>
        )}
      </div>
    </div>
  );
}