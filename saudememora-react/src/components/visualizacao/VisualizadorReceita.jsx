import React from "react";
import { useNavigate } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import formatarData from "../../utils/formatarData";
import axiosInstance from "../../axiosConfig";

import {
  FaCalendarAlt,
  FaUserMd,
  FaAward,
  FaDownload,
  FaPills,
  FaStickyNote,
  FaArrowLeft,
} from "react-icons/fa";

export default function ReceitaComMedicamentos({ receita }) {
  const navigate = useNavigate();
  const urlBase = axiosInstance.defaults.baseURL;

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `${urlBase}/api/receitas/imagem/${receita.id}`
      );
      if (!response.ok) throw new Error("Erro ao baixar a imagem");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `receita-${receita.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch {
      alert("Erro ao baixar a imagem");
    }
  };

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
        <h3 className="text-secondary">Visualizar documento</h3>

        <button
          className="btn btn-outline-primary w-100"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft /> Voltar
        </button>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div
          className="card-body text-center"
          style={{
            height: "50%",
            maxHeight: "60vh",
            position: "relative",
            padding: 0,
            overflow: "hidden",
          }}
        >
          <TransformWrapper
            initialScale={1.1}
            minScale={1}
            maxScale={5}
            wheel={{ step: 0.1 }}
            doubleClick={{ disabled: true }}
          >
            <TransformComponent
              wrapperStyle={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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
                src={`${urlBase}/api/receitas/imagem/${receita.id}`}
                alt={`Imagem da receita ${receita.id}`}
                className="img-fluid rounded shadow"
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                  cursor: "grab",
                  userSelect: "none",
                  height: "auto",
                  width: "auto",
                  maxWidth: "100%",
                }}
                draggable={false}
              />
            </TransformComponent>
          </TransformWrapper>
        </div>

        <button
          onClick={handleDownload}
          className="btn btn-outline-secondary btn-sm mt-2 d-flex align-items-center justify-content-center"
          style={{
            width: "auto",
            minWidth: "140px",
            gap: "6px",
            fontWeight: "500",
            padding: "4px 10px",
            fontSize: "0.85rem",
          }}
          title="Baixar imagem"
        >
          <FaDownload size={14} />
          Salvar imagem
        </button>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body" style={{ textAlign: "justify" }}>
          <p>
            <FaCalendarAlt /> <strong>Data: </strong>
            {formatarData(receita.dataReceita)}
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
            <FaStickyNote /> <strong>Observação: </strong>
            {receita.observacoes || "Nenhuma observação."}
          </p>
        </div>
      </div>

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
                    <strong>Posologia: </strong>
                    {med.quantidade} — {med.formaDeUso}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card shadow">
        <div className="card-body" style={{ textAlign: "justify" }}>
          <h4 className="text-primary">
            <FaStickyNote /> Resumo
          </h4>
          <textarea
            className="form-control mt-8 border border-info rounded"
            value={receita.resumo || ""}
            rows={10}
            readOnly
            style={{
              backgroundColor: "#f8f9fa",
              fontSize: "1rem",
              padding: "10px",
              textAlign: "justify",
              height: "auto",
              overflowY: "auto",
            }}
          ></textarea>
        </div>
      </div>
    </div>
  );
}
