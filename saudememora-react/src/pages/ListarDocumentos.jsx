import React, { useEffect, useState } from "react";
import DocumentoService from "../services/DocumentoService";
import Nav from "../components/Nav";

export default function ListarDocumentosCategorias() {
  const [documentos, setDocumentos] = useState({ P: [], R: [], E: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ⚠️ Use um ID de paciente real
  const idPaciente = 1;

  useEffect(() => {
    async function fetchDocumentos() {
      try {
        setLoading(true);
        const data = await DocumentoService.getPorPacienteAgrupado(idPaciente);
        setDocumentos(data);
      } catch (err) {
        setError("Erro ao carregar documentos.");
      } finally {
        setLoading(false);
      }
    }
    fetchDocumentos();
  }, [idPaciente]);

  const renderizarProntuarios = () => (
    <div className="category-section">
      <h2 className="category-title">Prontuários</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Médico</th>
              <th>Especialidade</th>
            </tr>
          </thead>
          <tbody>
            {documentos.P.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{new Date(doc.dataUpload).toLocaleDateString()}</td>
                <td>{doc.medico || "—"}</td>
                <td>{doc.especialidade || "—"}</td>
              </tr>
            ))}
            {documentos.P.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">Nenhum prontuário encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderizarReceitas = () => (
    <div className="category-section">
      <h2 className="category-title">Receitas</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Médico</th>
              <th>Medicamentos</th>
              <th>Posologia</th>
            </tr>
          </thead>
          <tbody>
            {documentos.R.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{new Date(doc.dataUpload).toLocaleDateString()}</td>
                <td>{doc.medico || "—"}</td>
                <td>{doc.medicamentos || "—"}</td>
                <td>{doc.posologia || "—"}</td>
              </tr>
            ))}
            {documentos.R.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">Nenhuma receita encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderizarExames = () => (
    <div className="category-section">
      <h2 className="category-title">Exames</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Tipo</th>
              <th>Laboratório</th>
            </tr>
          </thead>
          <tbody>
            {documentos.E.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{new Date(doc.dataUpload).toLocaleDateString()}</td>
                <td>{doc.tipo || "—"}</td>
                <td>{doc.laboratorio || "—"}</td>
              </tr>
            ))}
            {documentos.E.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">Nenhum exame encontrado.</td>
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
        {!loading && (
          <>
            {renderizarProntuarios()}
            {renderizarReceitas()}
            {renderizarExames()}
          </>
        )}
      </div>
    </div>
  );
}
