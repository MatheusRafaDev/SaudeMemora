import React, { useState } from "react";
import { FiUpload, FiFileText, FiCheckCircle } from "react-icons/fi";
// import "../../src/styles/UploadDocumentos.css"; // Importar o CSS para estilização

const UploadDocumentos = () => {
  const [documento, setDocumento] = useState(null);
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [statusProcessamento, setStatusProcessamento] = useState("Aguardando envio...");
  const [nomeArquivo, setNomeArquivo] = useState("");
  const [progresso, setProgresso] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumento(file);
      setNomeArquivo(file.name);
      setStatusProcessamento("Arquivo selecionado. Pronto para envio.");
      setProgresso(0);
    }
  };

  const handleTipoChange = (e) => {
    setTipoDocumento(e.target.value);
  };

  const handleUpload = () => {
    if (!documento || !tipoDocumento) {
      alert("Selecione um arquivo e um tipo de documento.");
      return;
    }

    setStatusProcessamento("Enviando...");
    setProgresso(0);

    const intervalo = setInterval(() => {
      setProgresso((prev) => {
        if (prev >= 100) {
          clearInterval(intervalo);
          setStatusProcessamento("Documento enviado e em processamento.");
        }
        return Math.min(prev + 10, 100);
      });
    }, 200);
  };

  return (
    <div className="upload-container">
      <h2><FiUpload /> Upload de Documentos</h2>

      <label>Selecione o documento:</label>
      <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={handleFileChange} />
      {nomeArquivo && (
        <p className="upload-file-info">
          <FiFileText />
          <strong>Arquivo:</strong> {nomeArquivo}
        </p>
      )}

      <label>Tipo de documento:</label>
      <select value={tipoDocumento} onChange={handleTipoChange}>
        <option value="">-- Selecione --</option>
        <option value="exames">Exames</option>
        <option value="consultas">Consultas</option>
        <option value="receitas">Receitas</option>
      </select>

      <button onClick={handleUpload} disabled={!documento || !tipoDocumento}>
        Enviar Documento
      </button>

      {progresso > 0 && (
        <div className="upload-progress">
          <label>Progresso:</label>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progresso}%` }} />
          </div>
        </div>
      )}

      <div className="upload-status">
        <h3>Status de Processamento:</h3>
        <p>
          {statusProcessamento === "Documento enviado e em processamento." ? (
            <span className="status-success">
              <FiCheckCircle />
              {statusProcessamento}
            </span>
          ) : statusProcessamento}
        </p>
      </div>
    </div>
  );
};

export default UploadDocumentos;
