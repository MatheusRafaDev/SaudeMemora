import React from "react";
import { useLocation } from "react-router-dom";
import ReceitaComMedicamentos from "../components/VisualizadorReceita";
import VisualizadorExame from "../components/VisualizadorExame"; 
import VisualizadorDocumentoClinico from "../components/VisualizadorDocumentoClinico"; 
import Nav from "../components/Nav";

const VisualizadorDocumento = () => {
  const location = useLocation();

  const documentoArray = location.state?.documento;
  const tipoDocumento = location.state?.tipo; 



  const documento = Array.isArray(documentoArray)
    ? documentoArray[0]
    : documentoArray;

  if (!documento) {
    return (
      <div>
        <Nav />
        <p>Nenhum documento selecionado.</p>
      </div>
    );
  }

  switch (tipoDocumento) {
    case "R": 
      return (
        <div>
          <Nav />
          <ReceitaComMedicamentos receita={documento} />
        </div>
      );

    case "E":
      return (
        <div>
          <Nav />
          <VisualizadorExame exame={documento} />
        </div>
      );

      case "D":
      return (
        <div>
          <Nav />
          <VisualizadorDocumentoClinico documentoClinico={documento} />
        </div>
      );


    default:
      return (
        <div>
          <Nav />
          <p>Tipo de documento não suportado para visualização.</p>
        </div>
      );
  }
};

export default VisualizadorDocumento;
