import React from "react";
import { useNavigate } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import formatarData from "../../utils/formatarData";
import axiosInstance from "../../axiosConfig";
import {
  FaCalendarAlt,
  FaFlask,
  FaNotesMedical,
  FaFileMedical,
  FaInfoCircle,
  FaDownload,
  FaArrowLeft,
  FaStickyNote,
} from "react-icons/fa";

export default function VisualizadorExame({ exame }) {
  const navigate = useNavigate();
  const urlBase = axiosInstance.defaults.baseURL;

  const handleDownload = async () => {
    try {
      const response = await fetch(`${urlBase}/api/exames/imagem/${exame.id}`);
      if (!response.ok) throw new Error("Erro ao baixar a imagem");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `exame-${exame.id}.jpg`; // nome ajustado para exame
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
        <h3 className="text-secondary">Visualizar documento - Exame</h3>

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
          style={{ height: "300px", position: "relative" }}
        >
          {exame.imagem ? (
            <TransformWrapper
              initialScale={1}
              minScale={1}
              maxScale={5}
              wheel={{ step: 0.1 }}
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
                  src={`${urlBase}/api/exames/imagem/${exame.id}`}
                  alt={`Imagem do exame ${exame.nomeExame}`}
                  className="img-fluid rounded shadow"
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                    cursor: "grab",
                  }}
                />
              </TransformComponent>
            </TransformWrapper>
          ) : (
            <p>Imagem não disponível</p>
          )}
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
          <h5>
            <FaFileMedical /> {exame.nomeExame || "Exame sem nome"}
          </h5>
          <p>
            <FaCalendarAlt /> <strong>Data:</strong>{" "}
            {formatarData(exame.dataExame)}
          </p>
          <p>
            <FaFlask /> <strong>Tipo:</strong> {exame.tipo || "Não informado"}
          </p>
          <p>
            <FaInfoCircle /> <strong>Laboratório:</strong>{" "}
            {exame.laboratorio || "Não informado"}
          </p>
          <p>
            <FaNotesMedical /> <strong>Resultado:</strong>{" "}
            {exame.resultado || "Sem resultado disponível"}
          </p>
          <p>
            <strong>Observações:</strong>{" "}
            {exame.observacoes || "Nenhuma observação."}
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
            value={exame.resumo || ""}
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
    </div>
  );
}
