import React, { useState } from 'react';
import '../styles/RelatorioDocumentos.css'; 


const RelatorioDocumentos = () => {
  const [tipo, setTipo] = useState('');
  const [status, setStatus] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const documentos = [
    {
      id: 1,
      paciente: 101,
      tipo: 'Receita',
      status: 'Finalizado',
      dataUpload: '30/04/2025, 10:20:00'
    },
    {
      id: 2,
      paciente: 102,
      tipo: 'Exame',
      status: 'Em processamento',
      dataUpload: '29/04/2025, 14:05:00'
    }
  ];

  return (
    <div className="container">
      <h2>Relatório de Documentos</h2>

      <label>Tipo:</label>
      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="">Todos</option>
        <option value="Receita">Receita</option>
        <option value="Exame">Exame</option>
      </select>

      <label>Status:</label>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">Todos</option>
        <option value="Finalizado">Finalizado</option>
        <option value="Em processamento">Em processamento</option>
      </select>

      <label>Data Início:</label>
      <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />

      <label>Data Fim:</label>
      <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />

      <div className="button-group">
        <button className="btn">Exportar para Excel</button>
        <button className="btn">Exportar para PDF</button>
      </div>

      {documentos.map(doc => (
        <div key={doc.id} className="card">
          <p><strong>ID:</strong> {doc.id}</p>
          <p><strong>Paciente:</strong> {doc.paciente}</p>
          <p><strong>Tipo:</strong> {doc.tipo}</p>
          <p><strong>Status:</strong> {doc.status}</p>
          <p><strong>Data Upload:</strong> {doc.dataUpload}</p>
        </div>
      ))}
    </div>
  );
};

export default RelatorioDocumentos;
