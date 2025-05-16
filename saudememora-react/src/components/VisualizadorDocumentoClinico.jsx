import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaFileAlt,
  FaUserMd,
  FaHospital,
  FaInfoCircle,
  FaStickyNote,
  FaArrowLeft,
} from "react-icons/fa";

export default function VisualizadorDocumentoClinico({ documentoClinico }) {
  const navigate = useNavigate();

  const documento = documentoClinico

  const dataFormatada = documento.data ? new Date(documento.data).toLocaleDateString("pt-BR") : "Não informado";

  return (
    <div
      className="mx-auto py-4"
      style={{
        maxWidth: "700px",
        marginTop: "30px",
        marginBottom: "30px",
        paddingLeft: "10px",
        paddingRight: "10px",
      }}
    >
      <div className="text-center mb-4">
        <h3 className="text-secondary">Visualizar documento - Clínico</h3>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body text-center">
          {documento.imagem? (
            <img
              src={`http://localhost:7070/api/documentosclinicos/imagem/${documento.id}`}
              alt={`Documento ${documento.tipo}`}
              className="img-fluid rounded"
              style={{
                maxHeight: "300px",
                objectFit: "contain",
                margin: "0 auto",
                display: "block",
              }}
            />
          ) : (
            <p className="text-muted">Documento não disponível</p>
          )}
        </div>
      </div>

      {/* Dados do documento */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body" style={{ textAlign: "justify" }}>
          <h5>
            <FaFileAlt /> {documento.tipo || "Documento sem tipo"}
          </h5>
          <p>
            <FaCalendarAlt /> <strong>Data:</strong> {dataFormatada}
          </p>
          <p>
            <FaUserMd /> <strong>Médico:</strong> {documento.medico || "Não informado"}
          </p>
          <p>
            <FaHospital /> <strong>Instituição:</strong> {documento.instituicao || "Não informado"}
          </p>
          <p>
            <FaInfoCircle /> <strong>Especialidade:</strong> {documento.especialidade || "Não informado"}
          </p>
          <p>
            <strong>Descrição:</strong> {documento.descricao || "Nenhuma descrição disponível."}
          </p>
          <p>
            <strong>Observações:</strong> {documento.observacoes || "Nenhuma observação."}
          </p>
        </div>

        
      </div>


      <div className="card shadow-sm border-0">
              <div className="card-body" style={{ textAlign: "justify" }}>
                <h4 className="text-primary">
                  <FaStickyNote /> Resumo
                </h4>
                <textarea
                  className="form-control mt-3 border border-info rounded"
                  value={documento.resumo || ""}
                  rows={5}
                  readOnly
                  style={{
                    backgroundColor: "#f8f9fa",
                    fontSize: "1rem",
                    padding: "10px",
                    textAlign: "justify",
                  }}
                ></textarea>
              </div>
            </div>

      {/* Botão voltar */}
      <div className="mt-4">
        <button
          className="btn btn-outline-primary w-100"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft /> Voltar
        </button>
      </div>
    </div>
  );
}