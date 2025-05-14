import React, { useEffect, useState } from "react";
import DocumentoService from "../services/DocumentoService";
import Nav from "../components/Nav";

export default function ListarDocumentos() {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paciente, setPaciente] = useState(null);

  useEffect(() => {
    const storedPaciente = localStorage.getItem("paciente");
    if (storedPaciente) {
      setPaciente(JSON.parse(storedPaciente));
    } else {
      setError("Paciente não encontrado.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function fetchDocumentos() {
      if (!paciente?.id) return;

      try {
        setLoading(true);
        const response = await DocumentoService.getPorPacienteAgrupado(paciente.id);
        setDocumentos(response.data || []);
      } catch (err) {
        setError("Erro ao carregar documentos.");
      } finally {
        setLoading(false);
      }
    }

    fetchDocumentos();
  }, [paciente]);

  const renderizarDocumentos = () => (
    <div className="category-section">
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Data de Upload</th>
              <th>Status</th>
              <th>Tipo do Documento</th>
              <th>ID do Paciente</th>
              <th>Visualizar</th>
            </tr>
          </thead>
          <tbody>
            {documentos.length > 0 ? (
              documentos.map((doc) => (
                <tr key={doc.id}>
                  <td>{new Date(doc.dataUpload).toLocaleDateString()}</td>
                  <td>{doc.status}</td>
                  <td>{doc.tipoDocumento}</td>
                  <td>{doc.paciente?.id || "—"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => (window.location.href = `/visualizar?id=${doc.id}`)}
                    >
                      Visualizar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  Nenhum documento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div>
      <Nav />
      <div className="container mt-4">
        <h1 className="title">Documentos</h1>
        {loading && <p className="loading-message">Carregando documentos...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && paciente && renderizarDocumentos()}
      </div>
    </div>
  );
}
