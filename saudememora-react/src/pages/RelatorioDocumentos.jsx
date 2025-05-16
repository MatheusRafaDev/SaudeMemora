import React, { useState } from 'react';
import '../styles/RelatorioDocumentos.css';
import { listarDocumentos } from "../services/DocumentosService";

const RelatorioDocumentos = () => {
  const [tipo, setTipo] = useState('');
  const [status, setStatus] = useState('');
  const [dataUpload, setDataUpload] = useState('');
  const [documentos, setDocumentos] = useState([]);

  const buscarDocumentos = async () => {
    try {
      console.log("Buscando documentos com os seguintes filtros:", {
        tipo,status,dataUpload
      }); 
      const resultado = await listarDocumentos(tipo, status, dataUpload);
      if (resultado.success) {
        setDocumentos(resultado.data);
      } else {
        alert("Erro ao buscar documentos");
      }
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
      alert("Erro inesperado.");
    }
  };

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
      <input type="date" value={dataUpload} onChange={(e) => setDataUpload(e.target.value)} />

      <div className="button-group">
        <button className="btn" onClick={buscarDocumentos}>Listar Documentos Encontrados</button>
        <button className="btn">Exportar para Excel</button>
        <button className="btn">Exportar para PDF</button>
      </div>

      {documentos.map(doc => (
        <div key={doc.id} className="card">
          <p><strong>ID:</strong> {doc.id}</p>
          <p><strong>Paciente:</strong> {doc.paciente}</p>
          <p><strong>Tipo:</strong> {doc.tipoDocumento}</p>
          <p><strong>Status:</strong> {doc.status}</p>
          <p><strong>Data Upload:</strong> {doc.dataUpload}</p>
        </div>
      ))}
    </div>
  );
};

export default RelatorioDocumentos;
