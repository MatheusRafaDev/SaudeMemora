import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaFlask,
  FaNotesMedical,
  FaFileMedical,
  FaInfoCircle,
  FaArrowLeft,
} from "react-icons/fa";

export default function VisualizadorExame({ exame }) {
  const navigate = useNavigate();

  const dataFormatada = exame.data ? new Date(exame.data).toLocaleDateString("pt-BR") : "Não informado";

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
        <h3 className="text-secondary">Visualizar documento - Exame</h3>
      </div>

      {/* Imagem do exame */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body text-center">
          {exame.imagem ? (
            <img
              src={`http://localhost:7070/api/exames/imagem/${exame.id}`}
              alt={`Imagem do exame ${exame.nomeExame}`}
              className="img-fluid rounded"
              style={{
                maxHeight: "300px",
                objectFit: "contain",
                margin: "0 auto",
                display: "block",
              }}
            />
          ) : (
            <p className="text-muted">Imagem não disponível</p>
          )}
        </div>
      </div>

      {/* Dados do exame */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body" style={{ textAlign: "justify" }}>
          <h5>
            <FaFileMedical /> {exame.nomeExame || "Exame sem nome"}
          </h5>
          <p>
            <FaCalendarAlt /> <strong>Data:</strong> {dataFormatada}
          </p>
          <p>
            <FaFlask /> <strong>Tipo:</strong> {exame.tipo || "Não informado"}
          </p>
          <p>
            <FaInfoCircle /> <strong>Laboratório:</strong> {exame.laboratorio || "Não informado"}
          </p>
          <p>
            <FaNotesMedical /> <strong>Resultado:</strong> {exame.resultado || "Sem resultado disponível"}
          </p>
          <p>
            <strong>Observações:</strong> {exame.observacoes || "Nenhuma observação."}
          </p>
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
