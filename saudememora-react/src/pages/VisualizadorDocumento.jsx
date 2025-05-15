import React from "react";
import { useLocation } from "react-router-dom"; // importa o hook
import { FiCalendar, FiUser } from "react-icons/fi";
import ReceitaComMedicamentos from "../components/ReceitaComMedicamentos";

import Nav from "../components/Nav";

const VisualizadorDocumento = () => {
  const location = useLocation();
  const documentoArray = location.state?.documento;
  const documento =
    Array.isArray(documentoArray) && documentoArray.length > 0
      ? documentoArray[0]
      : null;

  if (!documento) return <p>Nenhum documento selecionado.</p>;

  if (documento.medicamentos) {
    return (
      <div>
        <Nav />
        <ReceitaComMedicamentos receita={documento} />
      </div>
    );
  }
};

export default VisualizadorDocumento;
