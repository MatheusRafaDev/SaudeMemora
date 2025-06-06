import React from "react";
import { useLocation } from "react-router-dom";
import ReceitaComMedicamentos from "../components/visualizacao/VisualizadorReceita";
import VisualizadorExame from "../components/visualizacao/VisualizadorExame"; 
import VisualizadorDocumentoClinico from "../components/visualizacao/VisualizadorDocumentoClinico"; 


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

        <p>Nenhum documento selecionado.</p>
      </div>
    );
  }

  switch (tipoDocumento) {
    case "R": 
      return (
        <div>

          <ReceitaComMedicamentos receita={documento} />
        </div>
      );

    case "E":
      return (
        <div>

          <VisualizadorExame exame={documento} />
        </div>
      );

      case "D":
      return (
        <div>

          <VisualizadorDocumentoClinico documentoClinico={documento} />
        </div>
      );


    default:
      return (
        <div>

          <p>Tipo de documento não suportado para visualização.</p>
        </div>
      );
  }
};

export default VisualizadorDocumento;
