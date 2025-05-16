import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DocumentoService from "../services/DocumentoService";
import ReceitaService from "../services/ReceitaService";
import ExameService from "../services/ExameService";
import DocumentoClinicoService from "../services/DocumentoClinicoService";
import Nav from "../components/Nav";
import { FaPrescriptionBottle, FaVials, FaFileAlt, FaTrash, FaEye, FaUserMd } from "react-icons/fa";

export default function ListarDocumentos() {
  const [documentosDetalhados, setDocumentosDetalhados] = useState({
    DocumentosClinicos: [],
    Exames: [],
    Receitas: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paciente, setPaciente] = useState(null);
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

    const buscarDocumentosDetalhados = async () => {
      try {
        setLoading(true);
        const response = await DocumentoService.getPorPacienteAgrupado(paciente.id);
        console.log("Documentos brutos da API:", response.data);
        
        const docs = {
          DocumentosClinicos: await Promise.all(
            response.data
              .filter(doc => doc.tipoDocumento === "D")
              .map(async doc => {
                const detalhes = await DocumentoClinicoService.getDocumentoClinicoByDocumentoId(doc.id);
                const dados = Array.isArray(detalhes.data) ? detalhes.data[0] : detalhes.data;

                return {
                  id: doc.id, // Garante o ID correto
                  documentoId: doc.id, // Duplo mapeamento para segurança
                  ...dados,
                  ...doc,
                  tipo: "Documentos Clinicos",
                  titulo: `Consulta ${formatarData(doc.dataUpload)}`
                };
              })
          ),

          Exames: await Promise.all(
            response.data
              .filter(doc => doc.tipoDocumento === "E")
              .map(async doc => {
                const detalhes = await ExameService.getExameByDocumentoId(doc.id);
                const dados = Array.isArray(detalhes.data) ? detalhes.data[0] : detalhes.data;

                console.log(dados)

                return {
                  id: doc.id,
                  documentoId: doc.id,
                  ...dados,
                  ...doc,
                  tipo: "Exame",
                  titulo: dados?.nomeExame || "Exame Clínico"
                };
              })
          ),


          Receitas: await Promise.all(
            response.data
              .filter(doc => doc.tipoDocumento === "R")
              .map(async doc => {
                const detalhes = await ReceitaService.getReceitaByDocumentoId(doc.id);
                const dados = Array.isArray(detalhes.data) ? detalhes.data[0] : detalhes.data;
                console.log(dados)
                return {
                  id: doc.id,
                  documentoId: doc.id,
                  ...dados,
                  ...doc,
                  tipo: "Receita",
                  titulo: `Receita ${formatarData(doc.dataUpload)}`,
                  medico: dados?.medico || "Dr. Não Especificado",
                  crm: dados?.crmMedico
                };
              })
          )
        };

        console.log("Documentos processados:", docs);
        setDocumentosDetalhados(docs);
      } catch (err) {
        console.error("Erro completo:", err);
        setError("Erro ao carregar documentos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    buscarDocumentosDetalhados();
  }, [paciente]);

  const handleVisualizar = async (documentoId, tipo) => {
    try {
      console.log(`Visualizando documento ${documentoId} do tipo ${tipo}`);
      let documento;

      if (tipo === "R") {
        const res = await ReceitaService.getReceitaByDocumentoId(documentoId);
        documento = Array.isArray(res.data) ? res.data[0] : res.data;
      } else if (tipo === "E") {
        const res = await ExameService.getExameByDocumentoId(documentoId);
        documento = Array.isArray(res.data) ? res.data[0] : res.data;
      } else {
        const res = await DocumentoClinicoService.getDocumentoClinicoByDocumentoId(documentoId);
        
        console.log(res)
        documento = Array.isArray(res.data) ? res.data[0] : res.data;
      }

      console.log("Documento encontrado:", documento);
      navigate("/visualizar-documento", {
        state: { documento, tipo },
      });
    } catch (err) {
      console.error("Erro ao visualizar:", err);
      alert("Erro ao carregar o documento. Verifique o console para detalhes.");
    }
  };

  const handleDeletar = async (documentoId) => {
    if (!window.confirm(`Tem certeza que deseja deletar o documento ${documentoId}?`)) return;

    try {
      console.log(`Deletando documento ${documentoId}`);
      await DocumentoService.deleteDocumento(documentoId);
      
      setDocumentosDetalhados(prev => ({
        DocumentosClinicos: prev.DocumentosClinicos.filter(doc => doc.id !== documentoId && doc.documentoId !== documentoId),
        Exames: prev.Exames.filter(doc => doc.id !== documentoId && doc.documentoId !== documentoId),
        Receitas: prev.Receitas.filter(doc => doc.id !== documentoId && doc.documentoId !== documentoId)
      }));
      
      alert("Documento deletado com sucesso!");
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert(`Erro ao deletar documento ${documentoId}. Verifique o console.`);
    }
  };

  const formatarData = (dataString) => {
    try {
      const data = new Date(dataString);
      const dia = data.getDate().toString().padStart(2, '0');
      const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
      const mes = meses[data.getMonth()];
      const ano = data.getFullYear();
      return `${dia} ${mes} ${ano}`;
    } catch {
      return "Data inválida";
    }
  };

  return (
    <div>
    <Nav />
    <div className="prontuario-container">

      <div className="content">
        <h1 className="title">Documentos</h1>

        {loading && (
          <div className="loading-container">
            <p className="loading">🔄 Carregando documentos...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p className="error">❌ {error}</p>
            <button onClick={() => window.location.reload()} className="reload-btn">
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && Object.values(documentosDetalhados).flat().length === 0 && (
          <div className="empty-container">
            <p className="empty">Nenhum documento encontrado.</p>
          </div>
        )}

        <div className="documentos-wrapper">

          {documentosDetalhados.DocumentosClinicos.length > 0 && (
            <section className="documentos-section">
              <h2>
                <FaFileAlt className="icon" /> Documentos Clinicos
                <span className="badge">{documentosDetalhados.DocumentosClinicos.length}</span>
              </h2>
              <ul className="documentos-list">
                {documentosDetalhados.DocumentosClinicos.map((doc) => (
                  <li key={`P-${doc.id}`} className="documento-item">
                    <div className="documento-info">
                      <div className="documento-header">
                        <span className="documento-tipo">Consulta</span>
                        <span className="documento-id">ID: {doc.id}</span>
                        <span className="documento-data">{formatarData(doc.dataUpload)}</span>
                      </div>
                      {doc.medico && (
                        <div className="documento-meta">
                          <FaUserMd className="meta-icon" />
                          <span>{doc.medico}</span>
                          {doc.crm && <span className="crm">CRM: {doc.crm}</span>}
                        </div>
                      )}
                    </div>
                    <div className="documento-actions">
                      <button
                        className="btn-action"
                        onClick={() => handleVisualizar(doc.id, "D")}
                        title="Visualizar"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn-action danger"
                        onClick={() => handleDeletar(doc.id)}
                        title="Deletar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Seção de Exames */}
          {documentosDetalhados.Exames.length > 0 && (
            <section className="documentos-section">
              <h2>
                <FaVials className="icon" /> Exames
                <span className="badge">{documentosDetalhados.Exames.length}</span>
              </h2>
              <ul className="documentos-list">
                {documentosDetalhados.Exames.map((doc) => (
                  <li key={`E-${doc.id}`} className="documento-item">
                    <div className="documento-info">
                      <div className="documento-header">
                        <span className="documento-tipo">{doc.titulo}</span>
                        
                        <span className="documento-data">{formatarData(doc.dataUpload)}</span>
                      </div>
                      {doc.laboratorio && (
                        <div className="documento-meta">
                          <span>Laboratório: {doc.laboratorio}</span>
                        </div>
                      )}
                    </div>
                    <div className="documento-actions">
                      <button
                        className="btn-action"
                        onClick={() => handleVisualizar(doc.id, "E")}
                        title="Visualizar"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn-action danger"
                        onClick={() => handleDeletar(doc.id)}
                        title="Deletar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Seção de Receitas */}
          {documentosDetalhados.Receitas.length > 0 && (
            <section className="documentos-section">
              <h2>
                <FaPrescriptionBottle className="icon" /> Receitas
                <span className="badge">{documentosDetalhados.Receitas.length}</span>
              </h2>
              <ul className="documentos-list">
                {documentosDetalhados.Receitas.map((doc) => (
                  <li key={`R-${doc.id}`} className="documento-item">
                    <div className="documento-info">
                      <div className="documento-header">
                        <span className="documento-tipo">Receita</span>
                        <span className="documento-data">{formatarData(doc.dataUpload)}</span>
                      </div>
                      {doc.medico && (
                        <div className="documento-meta">
                          <FaUserMd className="meta-icon" />
                          <span>{doc.medico}</span>
                          {doc.crm && <span className="crm">CRM: {doc.crm}</span>}
                        </div>
                      )}
                    </div>
                    <div className="documento-actions">
                      <button
                        className="btn-action"
                        onClick={() => handleVisualizar(doc.id, "R")}
                        title="Visualizar"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn-action danger"
                        onClick={() => handleDeletar(doc.id)}
                        title="Deletar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        </div>
      </div>

      <style jsx>{`
        .prontuario-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #f8f9fa;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .content {
          flex: 1;
          padding: 20px;
          max-width: 1000px;
          margin: 0 auto;
          width: 100%;
        }
        
        .title {
          color: #2a7fba;
          margin-bottom: 24px;
          font-size: 1.8rem;
          text-align: center;
          font-weight: 600;
        }
        
        .loading-container,
        .error-container,
        .empty-container {
          text-align: center;
          padding: 30px;
          margin: 20px 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .loading {
          color: #2a7fba;
          font-size: 1.1rem;
        }
        
        .error {
          color: #dc3545;
          font-size: 1.1rem;
          margin-bottom: 15px;
        }
        
        .empty {
          color: #6c757d;
          font-size: 1.1rem;
        }
        
        .reload-btn {
          background-color: #2a7fba;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }
        
        .reload-btn:hover {
          background-color: #1e6fa8;
        }
        
        .documentos-wrapper {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        
        .documentos-section {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .documentos-section h2 {
          font-size: 1.3rem;
          padding: 15px 20px;
          margin: 0;
          background-color: #f1f8fe;
          color: #2a7fba;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid #e1e8ed;
          position: relative;
        }
        
        .icon {
          font-size: 1.1em;
        }
        
        .badge {
          background-color: #2a7fba;
          color: white;
          border-radius: 12px;
          padding: 2px 8px;
          font-size: 0.8rem;
          margin-left: auto;
        }
        
        .documentos-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .documento-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid #f0f0f0;
          transition: all 0.2s;
        }
        
        .documento-item:last-child {
          border-bottom: none;
        }
        
        .documento-item:hover {
          background-color: #fafafa;
        }
        
        .documento-info {
          flex: 1;
          min-width: 0;
        }
        
        .documento-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 6px;
        }
        
        .documento-tipo {
          font-weight: 600;
          color: #333;
          font-size: 0.95rem;
          white-space: nowrap;
        }
        
        .documento-id {
          font-size: 0.75rem;
          color: #999;
          background: #f5f5f5;
          padding: 2px 6px;
          border-radius: 4px;
          order: 1;
          width: 100%;
          margin-top: 4px;
        }
        
        .documento-data {
          color: #666;
          font-size: 0.85rem;
          white-space: nowrap;
        }
        
        .documento-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          color: #555;
          flex-wrap: wrap;
        }
        
        .meta-icon {
          font-size: 0.8rem;
          color: #6c757d;
        }
        
        .crm {
          font-size: 0.8rem;
          color: #6c757d;
          background: #f5f5f5;
          padding: 2px 6px;
          border-radius: 4px;
        }
        
        .documento-actions {
          display: flex;
          gap: 8px;
          margin-left: 15px;
          flex-shrink: 0;
        }
        
        .btn-action {
          background: none;
          border: none;
          color: #2a7fba;
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s;
          font-size: 0.9rem;
        }
        
        .btn-action:hover {
          background-color: #e1f0fa;
          transform: scale(1.1);
        }
        
        .btn-action.danger {
          color: #dc3545;
        }
        
        .btn-action.danger:hover {
          background-color: #f8e2e2;
        }
        
        @media (max-width: 768px) {
          .content {
            padding: 15px;
          }
          
          .title {
            font-size: 1.5rem;
          }
          
          .documento-item {
            padding: 12px 15px;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .documento-actions {
            margin-left: 0;
            align-self: flex-end;
          }
          
          .documento-header {
            gap: 6px;
          }
          
          .documento-id {
            order: 0;
            width: auto;
            margin-top: 0;
          }
        }
        
        @media (max-width: 480px) {
          .documentos-section h2 {
            font-size: 1.1rem;
            padding: 12px 15px;
          }
          
          .documento-meta {
            font-size: 0.8rem;
            gap: 6px;
          }
        }
      `}</style>
    </div>
  );
}