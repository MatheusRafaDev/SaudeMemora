import React from "react";
import { useNavigate } from "react-router-dom";
import formatarData from '../../utils/formatarData';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
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

  const documento = documentoClinico;


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
          {documento.imagem ? (
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
                  ></div>
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
                      src={`http://localhost:7070/api/documentosclinicos/imagem/${documento.id}`}
                      alt={`Documento ${documento.tipo}`}
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
            <p className="text-muted">Documento não disponível</p>
          )}
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body" style={{ textAlign: "justify" }}>
          <h5>
            <FaFileAlt /> {documento.tipo || "Documento Clinico"}
          </h5>
          <p>
            <FaCalendarAlt /> <strong>Data:</strong>{formatarData(documento.dataDocumentoCli)} 
          </p>
          <p>
            <FaUserMd /> <strong>Médico:</strong>{" "}
            {documento.medico || "Não informado"}
          </p>

          <p>
            <FaInfoCircle /> <strong>Especialidade:</strong>{" "}
            {documento.especialidade || "Não informado"}
          </p>
          <p>
            <strong>Conclusões:</strong>{" "}
            {documento.conclusoes || "Nenhuma descrição disponível."}
          </p>
          <p>
            <strong>Observações:</strong>{" "}
            {documento.observacoes || "Nenhuma observação."}
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
    </div>
  );
}
