import React from "react";
import { FiCalendar, FiUser, FiFileText, FiClipboard } from "react-icons/fi";
import "../styles/VisualizadorDocumento.css";

const VisualizadorDocumento = ({ documento }) => {
  if (!documento) return <p>Nenhum documento selecionado.</p>;

  const {
    data,
    medico,
    medicamento,
    dosagem,
    notas,
    imagem,
    textoExtraido
  } = documento;

  return (
    <div className="visualizador-container">
      <h2 className="titulo-sistema">SaúdeMemora</h2>
      <h3 className="subtitulo">Visualizar documento</h3>

      <div className="imagem-documento">
        <img src={imagem} alt="Documento" />
      </div>

      <div className="dados-extraidos">
        <div className="card-info">
          <p><FiCalendar /> <strong>Data:</strong> {data}</p>
          <p><FiUser /> <strong>Doutor:</strong> {medico}</p>
          <p><FiFileText /> <strong>Medicamento:</strong> {medicamento}</p>
          <p><FiClipboard /> <strong>Dosagem:</strong> {dosagem}</p>
          <p><strong>Notas:</strong> {notas}</p>
        </div>

        <div className="texto-extraido">
          <h4>Texto extraído</h4>
          <p style={{ whiteSpace: "pre-line" }}>{textoExtraido}</p>
        </div>
      </div>
    </div>
  );
};

export default VisualizadorDocumento;