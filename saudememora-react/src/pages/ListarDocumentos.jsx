import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DocumentoService from "../services/DocumentoService";
import formatarData from "../utils/formatarData";

import ReceitaService from "../services/ReceitaService";
import ExameService from "../services/ExameService";
import DocumentoClinicoService from "../services/DocumentoClinicoService";
import Nav from "../components/Nav";
import ReactModal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  FaPrescriptionBottle,
  FaVials,
  FaFileAlt,
  FaFileUpload,
  FaTrash,
  FaEye,
  FaUserMd,
  FaTimes,
  FaCheck,
  FaEdit,
  FaFilter,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";

export default function ListarDocumentos() {
  const [documentosDetalhados, setDocumentosDetalhados] = useState({
    DocumentosClinicos: [],
    Exames: [],
    Receitas: [],
  });
  const [documentosFiltrados, setDocumentosFiltrados] = useState({
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

  // Estados para os filtros
  const [filtros, setFiltros] = useState({
    texto: "",
    tipo: "todos",
    dataInicio: null,
    dataFim: null,
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Estados para paginação e ordenação
  const [paginacao, setPaginacao] = useState({
    paginaAtual: 1,
    itensPorPagina: 10,
  });

  const [ordenacao, setOrdenacao] = useState({
    campo: "dataUpload",
    direcao: "desc",
  });

  const [confirmationModal, setConfirmationModal] = useState({
    show: false,
    message: "",
    onConfirm: null,
    tipoDocumento: "",
  });

  ReactModal.setAppElement("#root");

  const closeModal = () => {
    setConfirmationModal((prev) => ({
      ...prev,
      show: false,
      message: "",
      onConfirm: null,
      tipoDocumento: "",
    }));
  };

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
                  paciente: {
                    id: doc.paciente?.id,
                    nome: doc.paciente?.nome,
                    cpf: doc.paciente?.cpf,
                    dataNascimento: doc.paciente?.dataNascimento,
                    sexo: doc.paciente?.sexo,
                  },
                  documento: {
                    id: doc.id,
                    tipo: "D",
                    tipoDocumento: doc.tipoDocumento,
                    status: doc.status,
                    dataUpload: doc.dataUpload,
                    data: new Date(doc.dataUpload),
                  },
                  clinico: {
                    id: dados?.id,
                    tipoDoc: dados?.tipo || "Documento Clínico",
                    dataDocumentoCli: dados?.dataDocumentoCli,
                    medico: dados?.medico,
                    crm: dados?.crmMedico,
                    especialidade: dados?.especialidade,
                    conteudo: dados?.conteudo,
                    observacoes: dados?.observacoes,
                    imagem: dados?.imagem,
                    resumo: dados?.resumo,
                    conclusoes: dados?.conclusoes,
                  },
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
                  paciente: {
                    id: doc.paciente?.id,
                    nome: doc.paciente?.nome,
                    cpf: doc.paciente?.cpf,
                    dataNascimento: doc.paciente?.dataNascimento,
                    sexo: doc.paciente?.sexo,
                  },
                  documento: {
                    id: doc.id,
                    tipo: "E",
                    tipoDocumento: doc.tipoDocumento,
                    status: doc.status,
                    dataUpload: doc.dataUpload,
                    data: new Date(doc.dataUpload),
                  },
                  exame: {
                    id: dados?.id,
                    nomeExame: dados?.nomeExame,
                    laboratorio: dados?.laboratorio,
                    dataExame: dados?.dataExame,
                    resultado: dados?.resultado,
                    observacoes: dados?.observacoes,
                    imagem: dados?.imagem,
                  },
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
                  paciente: {
                    id: doc.paciente?.id,
                    nome: doc.paciente?.nome,
                    cpf: doc.paciente?.cpf,
                    dataNascimento: doc.paciente?.dataNascimento,
                    sexo: doc.paciente?.sexo,
                  },
                  documento: {
                    id: doc.id,
                    tipo: "R",
                    tipoDocumento: doc.tipoDocumento,
                    status: doc.status,
                    dataUpload: doc.dataUpload,
                    data: new Date(doc.dataUpload),
                  },
                  receita: {
                    id: dados?.id,
                    medico: dados?.medico || "Dr. Não Especificado",
                    crm: dados?.crmMedico,
                    dataReceita: dados?.dataReceita,
                    medicamentos: dados?.medicamentos,
                    observacoes: dados?.observacoes,
                    validade: dados?.validade,
                  },
                  titulo: `Receita ${formatarData(doc.dataUpload)}`,
                };
              })
          ),
        };

        setDocumentosDetalhados(docs);
        setDocumentosFiltrados(docs);
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

  useEffect(() => {
    aplicarFiltros();
  }, [filtros, documentosDetalhados, ordenacao, paginacao]);

  const aplicarFiltros = () => {
    const { texto, tipo, dataInicio, dataFim } = filtros;

    const filtrarPorTexto = (doc) => {
      if (!texto) return true;
      const searchText = texto.toLowerCase();
      return (
        (doc.titulo && doc.titulo.toLowerCase().includes(searchText)) ||
        (doc.clinico?.medico &&
          doc.clinico.medico.toLowerCase().includes(searchText)) ||
        (doc.clinico?.tipoDoc &&
          doc.clinico.tipoDoc.toLowerCase().includes(searchText)) ||
        (doc.exame?.laboratorio &&
          doc.exame.laboratorio.toLowerCase().includes(searchText)) ||
        (doc.receita?.medico &&
          doc.receita.medico.toLowerCase().includes(searchText))
      );
    };

    const filtrarPorTipo = (doc) => {
      if (tipo === "todos") return true;
      return doc.documento.tipo === tipo;
    };

    const filtrarPorData = (doc) => {
      if (!dataInicio && !dataFim) return true;

      const docDate = new Date(doc.documento.dataUpload);

      if (dataInicio && !dataFim) {
        return docDate >= dataInicio;
      }

      if (!dataInicio && dataFim) {
        return docDate <= dataFim;
      }

      return docDate >= dataInicio && docDate <= dataFim;
    };

    const ordenarDocumentos = (documentos) => {
      return [...documentos].sort((a, b) => {
        let comparacao = 0;

        if (ordenacao.campo === "dataUpload") {
          comparacao =
            new Date(a.documento.dataUpload) - new Date(b.documento.dataUpload);
        } else if (ordenacao.campo === "tipo") {
          comparacao = a.documento.tipo.localeCompare(b.documento.tipo);
        } else if (ordenacao.campo === "medico") {
          const medicoA = a.clinico?.medico || a.receita?.medico || "";
          const medicoB = b.clinico?.medico || b.receita?.medico || "";
          comparacao = medicoA.localeCompare(medicoB);
        }

        return ordenacao.direcao === "asc" ? comparacao : -comparacao;
      });
    };

    const documentosFiltrados = {
      DocumentosClinicos: ordenarDocumentos(
        documentosDetalhados.DocumentosClinicos.filter(
          (doc) =>
            filtrarPorTexto(doc) && filtrarPorTipo(doc) && filtrarPorData(doc)
        )
      ),
      Exames: ordenarDocumentos(
        documentosDetalhados.Exames.filter(
          (doc) =>
            filtrarPorTexto(doc) && filtrarPorTipo(doc) && filtrarPorData(doc)
        )
      ),
      Receitas: ordenarDocumentos(
        documentosDetalhados.Receitas.filter(
          (doc) =>
            filtrarPorTexto(doc) && filtrarPorTipo(doc) && filtrarPorData(doc)
        )
      ),
    };

    const aplicarPaginacao = (documentos) => {
      const inicio = (paginacao.paginaAtual - 1) * paginacao.itensPorPagina;
      const fim = inicio + paginacao.itensPorPagina;
      return documentos.slice(inicio, fim);
    };

    setDocumentosFiltrados({
      DocumentosClinicos: aplicarPaginacao(
        documentosFiltrados.DocumentosClinicos
      ),
      Exames: aplicarPaginacao(documentosFiltrados.Exames),
      Receitas: aplicarPaginacao(documentosFiltrados.Receitas),
    });
  };

  const limparFiltros = () => {
    setFiltros({
      texto: "",
      tipo: "todos",
      dataInicio: null,
      dataFim: null,
    });
    setPaginacao({ ...paginacao, paginaAtual: 1 });
  };

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

  const handleAlterar = (tipo, id) => {
    navigate("/editar-documento", {
      state: {
        tipo,
        id,
      },
    });
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
                (doc) => doc.documento.id !== documentoId
              ),
              Exames: prev.Exames.filter(
                (doc) => doc.documento.id !== documentoId
              ),
              Receitas: prev.Receitas.filter(
                (doc) => doc.documento.id !== documentoId
              ),
            }));

            closeModal();
            showNotification(
              `${getTipoNome(tipo)} deletado com sucesso`,
              "success"
            );
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

  const toggleOrdenacao = (campo) => {
    if (ordenacao.campo === campo) {
      setOrdenacao({
        ...ordenacao,
        direcao: ordenacao.direcao === "asc" ? "desc" : "asc",
      });
    } else {
      setOrdenacao({
        campo,
        direcao: "asc",
      });
    }
  };

  const getIconeOrdenacao = (campo) => {
    if (ordenacao.campo !== campo) return <FaSort />;
    return ordenacao.direcao === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const ConfirmationModal = ({ 
  show, 
  message, 
  onConfirm, 
  onClose,
  loading = false 
}) => {
  return (
    <ReactModal
      isOpen={show}
      onRequestClose={onClose}
      contentLabel="Confirmação"
      className="modal-content"
      overlayClassName="modal-overlay"
      shouldCloseOnOverlayClick={!loading}
      shouldCloseOnEsc={!loading}
    >
      <div className="modal-inner">
        <div className="modal-header">
          <h3 className="modal-title">Confirmar ação</h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="modal-close-btn"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body">
          <p>{message}</p>
        </div>
        
        <div className="modal-footer">
          <button
            onClick={onClose}
            disabled={loading}
            className="modal-cancel-btn"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="modal-confirm-btn"
          >
            {loading ? (
              <span className="loading-spinner">Processando...</span>
            ) : (
              <>
                <FaCheck /> Confirmar
              </>
            )}
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

  const totalDocumentos = () => {
    return (
      documentosDetalhados.DocumentosClinicos.length +
      documentosDetalhados.Exames.length +
      documentosDetalhados.Receitas.length
    );
  };

  const totalDocumentosFiltrados = () => {
    return (
      documentosDetalhados.DocumentosClinicos.filter(
        (doc) => filtros.tipo === "todos" || doc.documento.tipo === filtros.tipo
      ).length +
      documentosDetalhados.Exames.filter(
        (doc) => filtros.tipo === "todos" || doc.documento.tipo === filtros.tipo
      ).length +
      documentosDetalhados.Receitas.filter(
        (doc) => filtros.tipo === "todos" || doc.documento.tipo === filtros.tipo
      ).length
    );
  };

  return (
    <div>
      <Nav />

      <ConfirmationModal
        show={confirmationModal.show}
        message={confirmationModal.message}
        onConfirm={confirmationModal.onConfirm}
        onClose={closeModal}
      />

      <div className="prontuario-container">
        <div className="content">
          <div className="header-with-actions">
            <h1 className="title">Documentos</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {totalDocumentosFiltrados()} de {totalDocumentos()} documentos
              </span>

              <div className="flex gap-2">
                <button
                  className="btn-processar"
                  onClick={() => navigate("/upload-documentos")}
                >
                  <FaFileUpload /> Processar Novo Documento
                </button>

                <button
                  className="btn-filter"
                  onClick={() => setMostrarFiltros(!mostrarFiltros)}
                >
                  <FaFilter />{" "}
                  {mostrarFiltros ? "Ocultar Filtros" : "Mostrar Filtros"}
                </button>
              </div>
            </div>
          </div>

          {mostrarFiltros && (
            <div className="filtros-container">
              <div className="filtro-group">
                <label htmlFor="texto">Buscar:</label>
                <div className="search-input">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    id="texto"
                    placeholder="Pesquisar por título, médico, etc..."
                    value={filtros.texto}
                    onChange={(e) =>
                      setFiltros({ ...filtros, texto: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="filtro-group">
                <label htmlFor="tipo">Tipo de Documento:</label>
                <select
                  id="tipo"
                  value={filtros.tipo}
                  onChange={(e) =>
                    setFiltros({ ...filtros, tipo: e.target.value })
                  }
                >
                  <option value="todos">Todos</option>
                  <option value="D">Documentos Clínicos</option>
                  <option value="E">Exames</option>
                  <option value="R">Receitas</option>
                </select>
              </div>

              <div className="filtro-group">
                <label>Período:</label>
                <div className="date-range">
                  <DatePicker
                    selected={filtros.dataInicio}
                    onChange={(date) =>
                      setFiltros({ ...filtros, dataInicio: date })
                    }
                    selectsStart
                    startDate={filtros.dataInicio}
                    endDate={filtros.dataFim}
                    placeholderText="Data inicial"
                    className="date-input"
                    dateFormat="dd/MM/yyyy"
                    isClearable
                  />
                  <span>até</span>
                  <DatePicker
                    selected={filtros.dataFim}
                    onChange={(date) =>
                      setFiltros({ ...filtros, dataFim: date })
                    }
                    selectsEnd
                    startDate={filtros.dataInicio}
                    endDate={filtros.dataFim}
                    minDate={filtros.dataInicio}
                    placeholderText="Data final"
                    className="date-input"
                    dateFormat="dd/MM/yyyy"
                    isClearable
                  />
                </div>
              </div>

              <button
                className="btn-limpar"
                onClick={limparFiltros}
                disabled={
                  !filtros.texto &&
                  filtros.tipo === "todos" &&
                  !filtros.dataInicio &&
                  !filtros.dataFim
                }
              >
                Limpar Filtros
              </button>
            </div>
          )}

          <div className="controles-avancados">
            <div className="ordenacao">
              <label>Ordenar por:</label>
              <select
                value={ordenacao.campo}
                onChange={(e) =>
                  setOrdenacao({ ...ordenacao, campo: e.target.value })
                }
              >
                <option value="dataUpload">Data</option>
                <option value="tipo">Tipo</option>
                <option value="medico">Médico</option>
              </select>
              <button
                onClick={() =>
                  setOrdenacao({
                    ...ordenacao,
                    direcao: ordenacao.direcao === "asc" ? "desc" : "asc",
                  })
                }
                className="btn-ordenacao"
              >
                {ordenacao.direcao === "asc" ? <FaSortUp /> : <FaSortDown />}
              </button>
            </div>

            <div className="paginacao">
              <button
                disabled={paginacao.paginaAtual === 1}
                onClick={() =>
                  setPaginacao({
                    ...paginacao,
                    paginaAtual: paginacao.paginaAtual - 1,
                  })
                }
                className="btn-paginacao"
              >
                Anterior
              </button>
              <span>Página {paginacao.paginaAtual}</span>
              <button
                onClick={() =>
                  setPaginacao({
                    ...paginacao,
                    paginaAtual: paginacao.paginaAtual + 1,
                  })
                }
                className="btn-paginacao"
                disabled={
                  paginacao.paginaAtual * paginacao.itensPorPagina >=
                  totalDocumentosFiltrados()
                }
              >
                Próxima
              </button>
            </div>
          </div>

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
            Object.values(documentosFiltrados).flat().length === 0 && (
              <div className="empty-container">
                <p className="empty">
                  {totalDocumentos() === 0
                    ? "Nenhum documento encontrado."
                    : "Nenhum documento corresponde aos filtros aplicados."}
                </p>
                {totalDocumentos() > 0 && (
                  <button
                    onClick={limparFiltros}
                    className="btn-limpar-filtros"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            )}

          <div className="documentos-wrapper">
            {documentosFiltrados.DocumentosClinicos.length > 0 && (
              <section className="documentos-section">
                <h2>
                  <FaFileAlt className="icon" /> Documentos Clínicos
                  <span className="badge">
                    {documentosFiltrados.DocumentosClinicos.length}
                  </span>
                </h2>
                <ul className="documentos-list">
                  {documentosFiltrados.DocumentosClinicos.map((doc) => (
                    <li
                      key={`D-${doc.documento.id}`}
                      className="documento-item"
                    >
                      <div className="documento-info">
                        <div className="documento-header">
                          <span className="documento-tipo">
                            {doc.clinico.tipoDoc}
                          </span>
                          <span className="documento-id">
                            ID: {doc.documento.id}
                          </span>
                          <div
                            className="documento-data"
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span className="documento-data">
                              Upload: {formatarData(doc.documento.dataUpload)}
                            </span>

                            <span className="documento-data">
                              Data do documento Clinico:{" "}
                              {formatarData(doc.clinico.dataDocumentoCli)}
                            </span>
                          </div>
                        </div>
                        {doc.clinico.medico && (
                          <div className="documento-meta">
                            <FaUserMd className="meta-icon" />
                            <span>{doc.clinico.medico}</span>
                            {doc.clinico.crm && (
                              <span className="crm">
                                CRM: {doc.clinico.crm}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="documento-actions">
                        <button
                          className="btn-action"
                          onClick={() =>
                            handleVisualizar(
                              doc.documento.id,
                              doc.documento.tipo
                            )
                          }
                          title="Visualizar"
                        >
                          <FaEye />
                        </button>

                        <button
                          className="btn-action primary"
                          onClick={() =>
                            handleAlterar(doc.documento.tipo, doc.clinico.id)
                          }
                          title="Alterar"
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn-action danger"
                          onClick={() =>
                            handleDeletar(doc.documento.id, doc.documento.tipo)
                          }
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

            {documentosFiltrados.Exames.length > 0 && (
              <section className="documentos-section">
                <h2>
                  <FaVials className="icon" /> Exames
                  <span className="badge">
                    {documentosFiltrados.Exames.length}
                  </span>
                </h2>
                <ul className="documentos-list">
                  {documentosFiltrados.Exames.map((doc) => (
                    <li
                      key={`E-${doc.documento.id}`}
                      className="documento-item"
                    >
                      <div className="documento-info">
                        <div className="documento-header">
                          <span className="documento-tipo">{doc.titulo}</span>
                          <span className="documento-id">
                            ID: {doc.documento.id}
                          </span>

                          <div
                            className="documento-data"
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span>
                              Upload: {formatarData(doc.documento.dataUpload)}
                            </span>
                            <span>
                              Data do exame: {formatarData(doc.exame.dataExame)}
                            </span>
                          </div>
                        </div>
                        {doc.exame.laboratorio && (
                          <div className="documento-meta">
                            <span>Laboratório: {doc.exame.laboratorio}</span>
                          </div>
                        )}
                      </div>
                      <div className="documento-actions">
                        <button
                          className="btn-action"
                          onClick={() =>
                            handleVisualizar(
                              doc.documento.id,
                              doc.documento.tipo
                            )
                          }
                          title="Visualizar"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn-action primary"
                          onClick={() =>
                            handleAlterar(doc.documento.tipo, doc.exame.id)
                          }
                          title="Alterar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn-action danger"
                          onClick={() =>
                            handleDeletar(doc.documento.id, doc.documento.tipo)
                          }
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

            {documentosFiltrados.Receitas.length > 0 && (
              <section className="documentos-section">
                <h2>
                  <FaPrescriptionBottle className="icon" /> Receitas
                  <span className="badge">
                    {documentosFiltrados.Receitas.length}
                  </span>
                </h2>
                <ul className="documentos-list">
                  {documentosFiltrados.Receitas.map((doc) => (
                    <li
                      key={`R-${doc.documento.id}`}
                      className="documento-item"
                    >
                      <div className="documento-info">
                        <div className="documento-header">
                          <span className="documento-tipo">Receita</span>
                          <span className="documento-id">
                            ID: {doc.documento.id}
                          </span>
                          <div
                            className="documento-data"
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span>
                              Upload: {formatarData(doc.documento.dataUpload)}
                            </span>
                            <span>
                              Data da receita:{" "}
                              {formatarData(doc.receita.dataReceita)}
                            </span>
                          </div>
                        </div>
                        {doc.receita.medico && (
                          <div className="documento-meta">
                            <FaUserMd className="meta-icon" />
                            <span>{doc.receita.medico}</span>
                            {doc.receita.crm && (
                              <span className="crm">
                                CRM: {doc.receita.crm}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="documento-actions">
                        <button
                          className="btn-action"
                          onClick={() =>
                            handleVisualizar(
                              doc.documento.id,
                              doc.documento.tipo
                            )
                          }
                          title="Visualizar"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn-action primary"
                          onClick={() =>
                            handleAlterar(doc.documento.tipo, doc.receita.id)
                          }
                          title="Alterar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn-action danger"
                          onClick={() =>
                            handleDeletar(doc.documento.id, doc.documento.tipo)
                          }
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
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .btn-processar {
          background-color: #2a7fba; /* Azul */
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-processar:hover {
          background-color: #1e6fa8; /* Azul mais escuro no hover */
        }

        /* Botão "Filtros" (mantém o estilo original) */
        .btn-filter {
          background-color: #6c757d; /* Cinza */
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }

        .btn-filter:hover {
          background-color: #5a6268; /* Cinza mais escuro no hover */
        }

        /* Container dos botões (garante que fiquem alinhados) */
        .flex.gap-2 {
          display: flex;
          gap: 8px;
        }

        .title {
          color: #2a7fba;
          margin-bottom: 0;
          font-size: 1.8rem;
          font-weight: 600;
        }

        .header-with-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 15px;
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
          margin-bottom: 15px;
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

        .btn-limpar-filtros {
          background-color: #6c757d;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }

        .btn-limpar-filtros:hover {
          background-color: #5a6268;
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

        .btn-action.primary {
          color: #28a745;
        }

        .btn-action.primary:hover {
          background-color: #e6f7eb;
        }

        .btn-action.danger {
          color: #dc3545;
        }

        .btn-action.danger:hover {
          background-color: #f8e2e2;
        }

        .btn-filter {
          background-color: #2a7fba;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }

        .btn-filter:hover {
          background-color: #1e6fa8;
        }

        .filtros-container {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          margin-bottom: 20px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .filtro-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filtro-group label {
          font-weight: 600;
          font-size: 0.9rem;
          color: #555;
        }

        .filtro-group input,
        .filtro-group select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .search-input {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }

        .search-input input {
          padding-left: 35px;
          width: 100%;
        }

        .date-range {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .date-range span {
          color: #666;
        }

        .date-input {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
          width: 120px;
        }

        .btn-limpar {
          background: none;
          border: 1px solid #ddd;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          align-self: flex-end;
          transition: all 0.2s;
        }

        .btn-limpar:hover {
          background-color: #f5f5f5;
        }

        .btn-limpar:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .controles-avancados {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .ordenacao,
        .paginacao {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ordenacao select {
          padding: 6px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .btn-ordenacao {
          background: none;
          border: 1px solid #ddd;
          padding: 6px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-ordenacao:hover {
          background-color: #f5f5f5;
        }

        .paginacao {
          font-size: 0.9rem;
        }

        .btn-paginacao {
          background: none;
          border: 1px solid #ddd;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-paginacao:hover {
          background-color: #f5f5f5;
        }

        .btn-paginacao:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-exportar {
          background-color: #d32f2f;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }

        .btn-exportar:hover {
          background-color: #b71c1c;
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

          .filtros-container {
            grid-template-columns: 1fr;
          }

          .date-range {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }

          .date-input {
            width: 100%;
          }

          .controles-avancados {
            flex-direction: column;
            align-items: flex-start;
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
