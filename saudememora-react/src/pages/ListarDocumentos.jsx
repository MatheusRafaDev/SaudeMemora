import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DocumentoService from "../services/DocumentoService";
import ReceitaService from "../services/ReceitaService";
import ExameService from "../services/ExameService";
import DocumentoClinicoService from "../services/DocumentoClinicoService";
import Nav from "../components/Nav";
import ReactModal from "react-modal";

import {
  FaPrescriptionBottle,
  FaVials,
  FaFileAlt,
  FaTrash,
  FaEye,
  FaUserMd,
  FaTimes,
  FaCheck,
} from "react-icons/fa";

export default function ListarDocumentos() {
  const [documentosDetalhados, setDocumentosDetalhados] = useState({
    DocumentosClinicos: [],
    Exames: [],
    Receitas: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [paciente, setPaciente] = useState(null);
  const navigate = useNavigate();

  const [confirmationModal, setConfirmationModal] = useState({
    show: false,
    message: "",
    onConfirm: null,
    tipoDocumento: "",
  });

  const closeModal = () => {
    setConfirmationModal((prev) => ({
      ...prev,
      show: false,
      message: "",
      onConfirm: null,
      tipoDocumento: "",
    }));
  };

  // Mostrar notificação
  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      5000
    );
  };

  const showConfirmationModal = (message, onConfirm, tipoDocumento) => {
    setConfirmationModal({
      show: true,
      message,
      onConfirm,
      tipoDocumento,
    });
  };

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
        const response = await DocumentoService.getPorPacienteAgrupado(
          paciente.id
        );

        const docs = {
          DocumentosClinicos: await Promise.all(
            response.data
              .filter((doc) => doc.tipoDocumento === "D")
              .map(async (doc) => {
                const detalhes =
                  await DocumentoClinicoService.getDocumentoClinicoByDocumentoId(
                    doc.id
                  );
                const dados = Array.isArray(detalhes.data)
                  ? detalhes.data[0]
                  : detalhes.data;

                return {
                  id: doc.id,
                  documentoId: doc.id,
                  ...dados,
                  ...doc,
                  tipo: "D",
                  tipoDoc: detalhes.data[0]?.tipo  || "Documento Clínico",
                  titulo: `Consulta ${formatarData(doc.dataUpload)}`,
                };
              })
          ),

          Exames: await Promise.all(
            response.data
              .filter((doc) => doc.tipoDocumento === "E")
              .map(async (doc) => {
                const detalhes = await ExameService.getExameByDocumentoId(
                  doc.id
                );
                const dados = Array.isArray(detalhes.data)
                  ? detalhes.data[0]
                  : detalhes.data;

                return {
                  id: doc.id,
                  documentoId: doc.id,
                  ...dados,
                  ...doc,
                  tipo: "E",
                  titulo: dados?.nomeExame || "Exame Clínico",
                };
              })
          ),

          Receitas: await Promise.all(
            response.data
              .filter((doc) => doc.tipoDocumento === "R")
              .map(async (doc) => {
                const detalhes = await ReceitaService.getReceitaByDocumentoId(
                  doc.id
                );
                const dados = Array.isArray(detalhes.data)
                  ? detalhes.data[0]
                  : detalhes.data;

                return {
                  id: doc.id,
                  documentoId: doc.id,
                  ...dados,
                  ...doc,
                  tipo: "R",
                  titulo: `Receita ${formatarData(doc.dataUpload)}`,
                  medico: dados?.medico || "Dr. Não Especificado",
                  crm: dados?.crmMedico,
                };
              })
          ),
        };

        setDocumentosDetalhados(docs);
      } catch (err) {
        console.error("Erro ao carregar documentos:", err);
        setError("Erro ao carregar documentos. Tente novamente.");
        showNotification("Erro ao carregar documentos", "error");
      } finally {
        setLoading(false);
      }
    };

    buscarDocumentosDetalhados();
  }, [paciente]);

  const handleVisualizar = async (documentoId, tipo) => {
    try {
      let documento;

      if (tipo === "R") {
        const res = await ReceitaService.getReceitaByDocumentoId(documentoId);
        documento = Array.isArray(res.data) ? res.data[0] : res.data;
      } else if (tipo === "E") {
        const res = await ExameService.getExameByDocumentoId(documentoId);
        documento = Array.isArray(res.data) ? res.data[0] : res.data;
      } else {
        const res =
          await DocumentoClinicoService.getDocumentoClinicoByDocumentoId(
            documentoId
          );
        documento = Array.isArray(res.data) ? res.data[0] : res.data;
      }

      navigate("/visualizar-documento", {
        state: { documento, tipo },
      });
    } catch (err) {
      console.error("Erro ao visualizar documento:", err);
      showNotification("Erro ao carregar o documento", "error");
    }
  };

  const handleDeletar = async (documentoId, tipo) => {
    showConfirmationModal(
      `Tem certeza que deseja deletar este ${getTipoNome(tipo)}?`,
      async () => {
        try {
          const response = await DocumentoService.deleteDocumento(
            documentoId,
            tipo
          );

          if (response.success) {
            setDocumentosDetalhados((prev) => ({
              DocumentosClinicos: prev.DocumentosClinicos.filter(
                (doc) => doc.id !== documentoId
              ),
              Exames: prev.Exames.filter((doc) => doc.id !== documentoId),
              Receitas: prev.Receitas.filter((doc) => doc.id !== documentoId),
            }));

             closeModal();

          } else {
            showNotification(
              response.message || `Erro ao deletar ${getTipoNome(tipo)}`,
              "error"
            );
          }
        } catch (err) {
          console.error("Erro ao deletar documento:", err);
          showNotification(`Erro ao deletar ${getTipoNome(tipo)}`, "error");
        }
      },
      tipo
    );
  };

  const getTipoNome = (tipo) => {
    switch (tipo) {
      case "D":
        return "Documento Clínico";
      case "E":
        return "Exame";
      case "R":
        return "Receita";
      default:
        return "Documento";
    }
  };

  const formatarData = (dataString) => {
    try {
      const data = new Date(dataString);
      const dia = data.getDate().toString().padStart(2, "0");
      const meses = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];
      const mes = meses[data.getMonth()];
      const ano = data.getFullYear();
      return `${dia} ${mes} ${ano}`;
    } catch {
      return "Data inválida";
    }
  };

  const Notification = () => {
    if (!notification.show) return null;

    const bgColor =
      notification.type === "error"
        ? "bg-red-100 border-red-400 text-red-700"
        : notification.type === "success"
        ? "bg-green-100 border-green-400 text-green-700"
        : "bg-blue-100 border-blue-400 text-blue-700";

    return (
      <div
        className={`fixed top-4 right-4 border-l-4 p-4 ${bgColor} rounded shadow-lg z-50`}
      >
        <div className="flex items-center">
          <span className="mr-2">
            {notification.type === "error"
              ? "❌"
              : notification.type === "success"
              ? "✅"
              : "ℹ️"}
          </span>
          <span>{notification.message}</span>
        </div>
      </div>
    );
  };

  const ConfirmationModal = ({ show, message, onConfirm, onClose }) => {
    return (
      <ReactModal
      isOpen={show}
      onRequestClose={onClose}
      contentLabel="Confirmação"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="modal-inner">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Confirmar ação</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FaTimes />
          </button>
        </div>
        <p className="mb-6 text-gray-600">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-md flex items-center gap-2 transition ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            <FaCheck /> Confirmar
          </button>
        </div>
      </div>
    </ReactModal>
    );
  };

  ReactModal.setAppElement("#root");

  return (
    <div>
      <Nav />
      <Notification />

      <ConfirmationModal
        show={confirmationModal.show}
        message={confirmationModal.message}
        onConfirm={confirmationModal.onConfirm}
        onClose={closeModal}
      />

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
              <button
                onClick={() => window.location.reload()}
                className="reload-btn"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            Object.values(documentosDetalhados).flat().length === 0 && (
              <div className="empty-container">
                <p className="empty">Nenhum documento encontrado.</p>
              </div>
            )}

          <div className="documentos-wrapper">
            {documentosDetalhados.DocumentosClinicos.length > 0 && (
              <section className="documentos-section">
                <h2>
                  <FaFileAlt className="icon" /> Documentos Clínicos
                  <span className="badge">
                    {documentosDetalhados.DocumentosClinicos.length}
                  </span>
                </h2>
                <ul className="documentos-list">

                  {documentosDetalhados.DocumentosClinicos.map((doc) => (


                    <li key={`D-${doc.id}`} className="documento-item">
                      <div className="documento-info">
                        <div className="documento-header">
                          <span className="documento-tipo">{doc.tipoDoc}</span>
                          <span className="documento-id">ID: {doc.id}</span>
                          <span className="documento-data">
                            {formatarData(doc.dataUpload)}
                          </span>
                        </div>
                        {doc.medico && (
                          <div className="documento-meta">
                            <FaUserMd className="meta-icon" />
                            <span>{doc.medico}</span>
                            {doc.crm && (
                              <span className="crm">CRM: {doc.crm}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="documento-actions">
                        <button
                          className="btn-action"
                          onClick={() => handleVisualizar(doc.id, doc.tipo)}
                          title="Visualizar"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn-action danger"
                          onClick={() => handleDeletar(doc.id, doc.tipo)}
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

            {documentosDetalhados.Exames.length > 0 && (
              <section className="documentos-section">
                <h2>
                  <FaVials className="icon" /> Exames
                  <span className="badge">
                    {documentosDetalhados.Exames.length}
                  </span>
                </h2>
                <ul className="documentos-list">
                  {documentosDetalhados.Exames.map((doc) => (
                    <li key={`E-${doc.id}`} className="documento-item">
                      <div className="documento-info">
                        <div className="documento-header">
                          <span className="documento-tipo">{doc.titulo}</span>
                          <span className="documento-id">ID: {doc.id}</span>
                          <div
                            className="documento-data"
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span>Upload: {formatarData(doc.dataUpload)}</span>
                            <span>Data do exame: {formatarData(doc.data)}</span>
                          </div>
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
                          onClick={() => handleVisualizar(doc.id, doc.tipo)}
                          title="Visualizar"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn-action danger"
                          onClick={() => handleDeletar(doc.id, doc.tipo)}
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

            {documentosDetalhados.Receitas.length > 0 && (
              <section className="documentos-section">
                <h2>
                  <FaPrescriptionBottle className="icon" /> Receitas
                  <span className="badge">
                    {documentosDetalhados.Receitas.length}
                  </span>
                </h2>
                <ul className="documentos-list">
                  {documentosDetalhados.Receitas.map((doc) => (
                    <li key={`R-${doc.id}`} className="documento-item">
                      <div className="documento-info">
                        <div className="documento-header">
                          <span className="documento-tipo">Receita</span>
                          <span className="documento-id">ID: {doc.id}</span>
                           <div
                            className="documento-data"
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span>Upload: {formatarData(doc.dataUpload)}</span>
                            <span>Data da receita: {formatarData(doc.dataReceita)}</span>
                          </div>
                        </div>
                        {doc.medico && (
                          <div className="documento-meta">
                            <FaUserMd className="meta-icon" />
                            <span>{doc.medico}</span>
                            {doc.crm && (
                              <span className="crm">CRM: {doc.crm}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="documento-actions">
                        <button
                          className="btn-action"
                          onClick={() => handleVisualizar(doc.id, doc.tipo)}
                          title="Visualizar"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn-action danger"
                          onClick={() => handleDeletar(doc.id, doc.tipo)}
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
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
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
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
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

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          position: relative;
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          width: 90%;
          padding: 1.5rem;
          outline: none;
        }

        .modal-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
      `}</style>
    </div>
  );
}
