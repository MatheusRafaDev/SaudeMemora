import React, { useState } from "react";
import { FiUpload, FiCamera, FiFileText, FiCheckCircle } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/UploadDocumento.css";
import Nav from "../components/Nav";


const UploadDocumentos = () => {
  const [documento, setDocumento] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("Aguardando envio...");
  const [progresso, setProgresso] = useState(0);
  const [resultadoProcessamento, setResultadoProcessamento] = useState("");
  const [botaoHabilitado, setBotaoHabilitado] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumento(file);
      setPreview(URL.createObjectURL(file));
      setStatus("Arquivo selecionado. Pronto para envio.");
      setProgresso(0);
      setResultadoProcessamento("");
    }
  };

  const handleCameraClick = () => {
    document.getElementById("cameraInput").click();
  };

  const handleUpload = () => {
    if (!documento) {
      alert("Selecione ou tire uma foto do documento.");
      return;
    }

    setStatus("Enviando...");
    setProgresso(0);

    const intervalo = setInterval(() => {
      setProgresso((prev) => {
        if (prev >= 100) {
          clearInterval(intervalo);
          setStatus("Documento enviado e em processamento.");
          setResultadoProcessamento("O documento foi processado com sucesso!");
          setBotaoHabilitado(true);
        }
        return Math.min(prev + 10, 100);
      });
    }, 200);
  };

  const handleAddDocument = () => {
    setDocumento(null);
    setPreview(null);
    setStatus("Aguardando envio...");
    setProgresso(0);
    setResultadoProcessamento("");
    setBotaoHabilitado(false);
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

        <div className="button-group">
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
            📄 Adicionar Novo Documento
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadDocumentos;
