import React, { useState } from "react";
import Nav from '../components/Nav';

const RelatorioDocumentos = () => {
  const [tipo, setTipo] = useState("");
  const [status, setStatus] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const documentos = [
    {
      id: 1,
      paciente: 101,
      tipo: "Receita",
      status: "Finalizado",
      dataUpload: "30/04/2025, 10:20:00",
    },
    {
      id: 2,
      paciente: 102,
      tipo: "Exame",
      status: "Em processamento",
      dataUpload: "29/04/2025, 14:05:00",
    },
  ];

  return (
    <div>
      <Nav />
      <div className="container mt-4">
        <h2 className="text-center mb-4">Relatório de Documentos</h2>

        <div className="mb-3">
          <label className="form-label">Tipo:</label>
          <select
            className="form-select"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Receita">Receita</option>
            <option value="Exame">Exame</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Status:</label>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Em processamento">Em processamento</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Data Início:</label>
          <input
            type="date"
            className="form-control"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Data Fim:</label>
          <input
            type="date"
            className="form-control"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </div>

        <div className="d-flex gap-2 mb-4">
          <button className="btn btn-primary w-100">Exportar para Excel</button>
          <button className="btn btn-success w-100">Exportar para PDF</button>
        </div>

        {documentos.map((doc) => (
          <div key={doc.id} className="card mb-3">
            <div className="card-body">
              <p><strong>ID:</strong> {doc.id}</p>
              <p><strong>Paciente:</strong> {doc.paciente}</p>
              <p><strong>Tipo:</strong> {doc.tipo}</p>
              <p><strong>Status:</strong> {doc.status}</p>
              <p><strong>Data Upload:</strong> {doc.dataUpload}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatorioDocumentos;
