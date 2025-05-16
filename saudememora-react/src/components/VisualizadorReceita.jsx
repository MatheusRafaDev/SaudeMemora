import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaUserMd,
  FaAward,
  FaPills,
  FaStickyNote,
  FaArrowLeft,
} from "react-icons/fa";

export default function ReceitaComMedicamentos({ receita }) {
  const navigate = useNavigate();

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
      {/* Cabeçalho */}
      <div className="text-center mb-4">
      <h3 className="text-secondary">Visualizar documento</h3>
      </div>

      {/* Imagem da Receita */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body text-center">
          {receita.imagem ? (
            <img
              src={`http://localhost:7070/api/receitas/imagem-receita/${receita.id}`}
              alt="Imagem da Receita"
              className="img-fluid rounded"
              style={{
                maxHeight: "300px",
                objectFit: "contain",
                transform: "scale(1.1)",
                transition: "transform 0.3s ease",
                margin: "0 auto",
                display: "block",
              }}
            />
          ) : (
            <p className="text-muted">Imagem não disponível</p>
          )}
        </div>
      </div>

      {/* Informações da Receita */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body" style={{ textAlign: "justify" }}>
          <p>
            <FaCalendarAlt /> <strong>Data: </strong>
            {new Date(receita.dataReceita).toLocaleDateString("pt-BR")}
          </p>
          <p>
            <FaUserMd /> <strong>Doutor(a): </strong>
            {receita.medico}
          </p>
          <p>
            <FaAward /> <strong>CRM/MS: </strong>
            {receita.crmMedico}
          </p>
          <p>
            <FaStickyNote /> <strong>Notas: </strong>
            {receita.observacoes || "Nenhuma observação."}
          </p>
        </div>
      </div>

      {/* Campo de Medicamentos */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body" style={{ textAlign: "justify" }}>
          <h4 className="text-primary">
            <FaPills /> Medicamentos
          </h4>
          <ul className="list-group mt-3">
            {receita.medicamentos.map((med) => (
              <li
                key={med.id}
                className="list-group-item d-flex justify-content-between align-items-start"
                style={{ textAlign: "justify" }}
              >
                <div>
                  <strong>{med.nome}</strong>
                  <p className="mb-0 text-muted">
                    {med.quantidade} — {med.formaDeUso}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Resumo */}
      <div className="card shadow-sm border-0">
        <div className="card-body" style={{ textAlign: "justify" }}>
          <h4 className="text-primary">
            <FaStickyNote /> Resumo
          </h4>
          <textarea
            className="form-control mt-3 border border-info rounded"
            value={receita.resumo || ""}
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

      {/* Botão de Voltar */}
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
