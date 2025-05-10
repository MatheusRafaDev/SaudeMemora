import React, { useEffect, useState } from "react";
import { FaFileAlt, FaFlask, FaPrescriptionBottle } from "react-icons/fa";
import DocumentoService from "../services/DocumentoService";
import Nav from "../components/Nav";

export default function ListarDocumentosCategorias() {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDocumentos() {
      try {
        setLoading(true);
        const data = await DocumentoService.getAll();
        setDocumentos(data);
      } catch {
        setError("Erro ao carregar documentos.");
      } finally {
        setLoading(false);
      }
    }
    fetchDocumentos();
  }, []);

  const filtrarPorCategoria = (categoria) =>
    documentos.filter((doc) => doc.categoria === categoria);

  const renderizarProntuarios = () => (
    <div className="category-section">
      <h2 className="category-title">Prontuários</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Médico</th>
              <th>Data</th>
              <th>Especialidade</th>

            </tr>
          </thead>
          <tbody>
            {filtrarPorCategoria("Prontuário").map((doc) => (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{doc.medico}</td>
                <td>{new Date(doc.data).toLocaleDateString()}</td>
                <td>{doc.especialidade}</td>
              </tr>
            ))}
            {filtrarPorCategoria("Prontuário").length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">
                  Nenhum prontuário encontrado.
                </td>
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
            {filtrarPorCategoria("Receita").map((doc) => (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{new Date(doc.data).toLocaleDateString()}</td>
                <td>{doc.medico}</td>
                <td>{doc.medicamentos}</td>
                <td>{doc.posologia}</td>

              </tr>
            ))}
            {filtrarPorCategoria("Receita").length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">
                  Nenhuma receita encontrada.
                </td>
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
            {filtrarPorCategoria("Exame").map((doc) => (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{new Date(doc.data).toLocaleDateString()}</td>
                <td>{doc.tipo}</td>
                <td>{doc.laboratorio}</td>

              </tr>
            ))}
            {filtrarPorCategoria("Exame").length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">
                  Nenhum exame encontrado.
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