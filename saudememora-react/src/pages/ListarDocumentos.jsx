import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DocumentoService from "../services/DocumentoService";
import ReceitaService from "../services/ReceitaService";
import ExameService from "../services/ExameService";
import Nav from "../components/Nav";
import { FaPrescriptionBottle, FaVials, FaFileAlt, FaTrash, FaEye } from "react-icons/fa";

export default function ListarDocumentos() {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState("TODOS");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("paciente");
    if (stored) {
      setPaciente(JSON.parse(stored));
    } else {
      setError("Paciente não encontrado.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!paciente?.id) return;

    const buscarDocumentos = async () => {
      try {
        setLoading(true);
        const response = await DocumentoService.getPorPacienteAgrupado(paciente.id);
        setDocumentos(response.data || []);
      } catch {
        setError("Erro ao carregar documentos.");
      } finally {
        setLoading(false);
      }
    };

    buscarDocumentos();
  }, [paciente]);

  const handleVisualizar = async (documentoId, tipo) => {
    try {
      let documento;

      if (tipo === "R") {
        const res = await ReceitaService.getReceitaByDocumentoId(documentoId);
        documento = res.data;
      } else if (tipo === "E") {
        const res = await ExameService.getExameByDocumentoId(documentoId);
        documento = res.data;
      } else {
        const res = await DocumentoService.getDocumentoById(documentoId);
        documento = res.data;
      }

      navigate("/visualizar-documento", {
        state: { documento, tipo },
      });
    } catch (err) {
      console.error("Erro ao buscar o documento:", err);
      alert("Não foi possível carregar os dados do documento.");
    }
  };

  const handleDeletar = async (documentoId) => {
    if (!window.confirm("Tem certeza que deseja deletar este documento?")) return;

    try {
      await DocumentoService.deleteDocumento(documentoId);
      setDocumentos(documentos.filter(doc => doc.id !== documentoId));
    } catch (err) {
      console.error("Erro ao deletar documento:", err);
      alert("Erro ao deletar o documento.");
    }
  };

  const getIcon = (tipo) => {
    switch (tipo) {
      case "R": return <FaPrescriptionBottle title="Receita" />;
      case "E": return <FaVials title="Exame" />;
      default: return <FaFileAlt title="Outro" />;
    }
  };

  const formatarTipo = (tipo) => {
    switch (tipo) {
      case "R": return "Receita";
      case "E": return "Exame";
      case "P": return "Prontuário";
      default: return tipo;
    }
  };

  const documentosFiltrados = documentos.filter(doc => 
    filtroTipo === "TODOS" || doc.tipoDocumento === filtroTipo
  );

  return (
    <div>
      <Nav />
      <div className="container mt-4">
        <h1 className="title">Documentos do Paciente</h1>

        <div className="mb-3">
          <button className={`btn btn-${filtroTipo === "TODOS" ? "dark" : "secondary"} me-2`} onClick={() => setFiltroTipo("TODOS")}>Todos</button>
          <button className={`btn btn-${filtroTipo === "R" ? "dark" : "secondary"} me-2`} onClick={() => setFiltroTipo("R")}>Receitas</button>
          <button className={`btn btn-${filtroTipo === "E" ? "dark" : "secondary"}`} onClick={() => setFiltroTipo("E")}>Exames</button>
        </div>

        {loading && <p>🔄 Carregando documentos...</p>}
        {error && <p className="text-danger">❌ {error}</p>}

        {!loading && documentosFiltrados.length === 0 && (
          <p className="text-center">Nenhum documento encontrado.</p>
        )}

        {!loading && documentosFiltrados.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Ícone</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Tipo</th>
                  <th>ID Paciente</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {documentosFiltrados.map((doc) => (
                  <tr key={doc.id}>
                    <td>{getIcon(doc.tipoDocumento)}</td>
                    <td>{new Date(doc.dataUpload).toLocaleDateString()}</td>
                    <td>{doc.status}</td>
                    <td>{formatarTipo(doc.tipoDocumento)}</td>
                    <td>{doc.paciente?.id || "—"}</td>
                    <td>
                      <button className="btn btn-sm btn-primary me-2" onClick={() => handleVisualizar(doc.id, doc.tipoDocumento)}>
                        <FaEye /> Ver
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeletar(doc.id)}>
                        <FaTrash /> Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
