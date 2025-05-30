import React from "react";
import { useNavigate } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
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

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body text-center" style={{ height: '300px', position: 'relative' }}>
          {exame.imagem ? (
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
                  >

                  </div>
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
                      src={`http://localhost:7070/api/exames/imagem/${exame.id}`}
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
                </>
              )}
            </TransformWrapper>
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
