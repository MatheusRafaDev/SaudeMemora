import React from "react";

export default function Exame({ exame }) {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Exame: {exame.titulo}</h5>
        <p><strong>Data:</strong> {new Date(exame.data).toLocaleDateString()}</p>
        <p><strong>Descrição:</strong> {exame.descricao}</p>
        <p><strong>Resultados:</strong> {exame.resultados || "Sem resultados disponíveis."}</p>
        <p><strong>Médico:</strong> {exame.medico || "Não informado."}</p>
      </div>
    </div>
  );
}