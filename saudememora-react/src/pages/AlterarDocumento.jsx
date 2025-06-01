import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  FaCalendarAlt,
  FaFileAlt,
  FaUserMd,
  FaHospital,
  FaInfoCircle,
  FaStickyNote,
  FaArrowLeft,
  FaSave,
  FaFlask,
  FaNotesMedical,
  FaFileMedical,
  FaPills,
  FaAward,
  FaEdit,
  FaCheck,
  FaTimes,
  FaImage,
  FaSearchPlus,
  FaSearchMinus,
  FaUndo,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DocumentoClinicoService from "../services/DocumentoClinicoService";
import ExameService from "../services/ExameService";
import ReceitaService from "../services/ReceitaService";
import DocumentoService from "../services/DocumentoService";
import Nav from "../components/Nav";

export default function AlterarDocumento() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extrai os parâmetros do estado da navegação
  const { documento: doc, tipo, documentoId } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [editingMedId, setEditingMedId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [docBase, setDocBase] = useState(null);

  // Estado inicial do documento
  const [documento, setDocumento] = useState({
    id: documentoId,
    tipo,
    documentoId: doc?.documento?.id || null,
    dataUpload: new Date(),
    idPaciente: doc?.paciente?.id || "",
    data: new Date(),
    observacoes: "",
    resumo: "",
    tipoDoc: "",
    medico: "",
    crm: "",
    instituicao: "",
    especialidade: "",
    descricao: "",
    nomeExame: "",
    tipoExame: "",
    laboratorio: "",
    resultado: "",
    dataReceita: new Date(),
    crmMedico: "",
    medicamentos: [],
    imagem: null,
    imagemUrl: null,
  });

  const [medicamentoEdit, setMedicamentoEdit] = useState({
    nome: "",
    quantidade: "",
    formaDeUso: "",
  });

  // Carrega os dados do documento
  useEffect(() => {
    if (!location.state) {
      navigate("/meus-documentos");
      return;
    }

    const carregarDocumento = async () => {
      try {
        setLoading(true);
        
        // Carrega o documento base se necessário
        if (doc?.documento?.id) {
          const docBaseResponse = await DocumentoService.getById(doc.documento.id);
          if (!docBaseResponse.success) {
            throw new Error("Documento base não encontrado");
          }
          setDocBase(docBaseResponse.data);
        }

        // Carrega os dados específicos do tipo de documento
        let response;
        switch (tipo) {
          case "D":
            response = await DocumentoClinicoService.getById(documentoId);
            break;
          case "E":
            response = await ExameService.getById(documentoId);
            break;
          case "R":
            response = await ReceitaService.getById(documentoId);
            break;
          default:
            throw new Error("Tipo de documento não suportado");
        }

        if (response.success) {
          const docFormatado = formatarDatas({
            ...response.data,
            idPaciente: doc?.paciente?.id || "",
            documentoId: doc?.documento?.id || null,
            dataUpload: doc?.documento?.dataUpload ? new Date(doc.documento.dataUpload) : new Date(),
          });
          setDocumento(docFormatado);
        } else {
          throw new Error(response.message || "Erro ao carregar documento específico");
        }
      } catch (error) {
        console.error("Erro:", error);
        showNotification(error.message || "Erro ao carregar documento", "error");
        navigate("/meus-documentos");
      } finally {
        setLoading(false);
      }
    };

    carregarDocumento();
  }, [location.state, navigate, tipo, documentoId, doc]);

  // Formata as datas do documento
  const formatarDatas = (doc) => {
    const formatDate = (dateStr) => {
      if (!dateStr) return new Date();
      return new Date(dateStr);
    };

    return {
      ...doc,
      data: doc.data,
      dataUpload: doc.dataUpload,
      dataReceita: doc.dataReceita,
      medicamentos: doc.medicamentos?.map((med) => ({
        ...med,
        id: med.id || Date.now(),
      })) || [],
    };
  };

  // Exibe notificações
  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 5000);
  };

  // Manipuladores de eventos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocumento((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, field) => {
    setDocumento((prev) => ({ ...prev, [field]: date }));
  };

  const handleMedicamentoEditChange = (e) => {
    const { name, value } = e.target;
    setMedicamentoEdit((prev) => ({ ...prev, [name]: value }));
  };

  // Medicamentos
  const iniciarEdicaoMedicamento = (medicamento) => {
    setEditingMedId(medicamento.id);
    setMedicamentoEdit({
      nome: medicamento.nome,
      quantidade: medicamento.quantidade,
      formaDeUso: medicamento.formaDeUso,
    });
  };

  const salvarEdicaoMedicamento = () => {
    if (!medicamentoEdit.nome || !medicamentoEdit.quantidade || !medicamentoEdit.formaDeUso) {
      showNotification("Preencha todos os campos do medicamento", "warning");
      return;
    }

    setDocumento((prev) => ({
      ...prev,
      medicamentos: prev.medicamentos.map((med) =>
        med.id === editingMedId ? { ...med, ...medicamentoEdit } : med
      ),
    }));
    setEditingMedId(null);
    setMedicamentoEdit({ nome: "", quantidade: "", formaDeUso: "" });
    showNotification("Medicamento atualizado com sucesso", "success");
  };

  const cancelarEdicaoMedicamento = () => {
    setEditingMedId(null);
    setMedicamentoEdit({ nome: "", quantidade: "", formaDeUso: "" });
  };

  // Manipulador de imagem
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumento((prev) => ({ ...prev, imagem: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação básica
    if (tipo === "D" && !documento.medico) {
      showNotification("O campo Médico é obrigatório", "warning");
      return;
    }

    setLoading(true);

    try {
      // 1. Atualiza o documento base se existir
      if (docBase) {
        const docBaseAtualizado = {
          id: docBase.id,
          dataUpload: documento.dataUpload,
          idPaciente: documento.idPaciente,
          imagem: documento.imagem,
        };

        const baseResponse = await DocumentoService.update(docBase.id, docBaseAtualizado);
        if (!baseResponse.success) {
          throw new Error(baseResponse.message || "Erro ao atualizar documento base");
        }
      }

      // 2. Atualiza o documento específico
      let response;
      switch (tipo) {
        case "D":
          response = await DocumentoClinicoService.update(documento.id, documento);
          break;
        case "E":
          response = await ExameService.update(documento.id, documento);
          break;
        case "R":
          response = await ReceitaService.update(documento.id, documento);
          break;
        default:
          throw new Error("Tipo de documento não suportado");
      }

      if (response.success) {
        showNotification("Documento atualizado com sucesso!", "success");
        navigate("/meus-documentos");
      } else {
        throw new Error(response.message || "Erro ao atualizar documento");
      }
    } catch (error) {
      console.error("Erro ao atualizar documento:", error);
      showNotification(error.message || "Erro ao atualizar documento", "error");
    } finally {
      setLoading(false);
    }
  };

  // Renderização da imagem
  const renderImagePreview = () => {
    const imageUrl =
      imagePreview ||
      documento.imagemUrl ||
      (tipo === "D"
        ? `http://localhost:7070/api/documentosclinicos/imagem/${documento.documentoId}`
        : tipo === "E"
        ? `http://localhost:7070/api/exames/imagem/${documento.id}`
        : `http://localhost:7070/api/receitas/imagem/${documento.id}`);

    if (imageUrl) {
      return (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body text-center" style={{ height: "300px", position: "relative" }}>
            <TransformWrapper
                          initialScale={1}
                          minScale={1}
                          maxScale={5}
                          wheel={{ step: 0.1 }}
                        >
                          {({ zoomIn, zoomOut, resetTransform }) => (
                            <>
                              <div
                                className="tools"
                                style={{
                                  position: "absolute",
                                  zIndex: 10,
                                  top: "10px",
                                  left: "10px",
                                }}
                              ></div>
                              <TransformComponent
                                wrapperStyle={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                                contentStyle={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <img
                                  src={imageUrl}
                                  className="img-fluid rounded shadow"
                                  style={{
                                    maxHeight: "100%",
                                    maxWidth: "100%",
                                    objectFit: "contain",
                                    cursor: "grab",
                                  }}
                                />
                              </TransformComponent>
                            </>
                          )}
                        </TransformWrapper>
          </div>
        </div>
      );
    }
    return (
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body text-center" style={{
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <p className="text-muted">Nenhuma imagem disponível</p>
        </div>
      </div>
    );
  };

  // Renderização condicional por tipo
  const renderFormByType = () => {
    switch (tipo) {
      case "D":
        return (
          <div className="card mb-3">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0"><FaFileAlt /> Documento Clínico</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">Tipo de Documento*</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tipoDoc"
                    value={documento.tipoDoc || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">Data*</label>
                  <DatePicker
                    selected={documento.data}
                    onChange={(date) => handleDateChange(date, "data")}
                    className="form-control"
                    dateFormat="dd/MM/yyyy"
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Médico*</label>
                  <input
                    type="text"
                    className="form-control"
                    name="medico"
                    value={documento.medico || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">CRM*</label>
                  <input
                    type="text"
                    className="form-control"
                    name="crm"
                    value={documento.crm || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">Especialidade</label>
                  <input
                    type="text"
                    className="form-control"
                    name="especialidade"
                    value={documento.especialidade || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Instituição</label>
                  <input
                    type="text"
                    className="form-control"
                    name="instituicao"
                    value={documento.instituicao || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Descrição</label>
                  <textarea
                    className="form-control"
                    name="descricao"
                    value={documento.descricao || ""}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "E":
        return (
          <div className="card mb-3">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0"><FaFlask /> Exame Médico</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">Nome do Exame*</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nomeExame"
                    value={documento.nomeExame || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">Data*</label>
                  <DatePicker
                    selected={documento.data}
                    onChange={(date) => handleDateChange(date, "data")}
                    className="form-control"
                    dateFormat="dd/MM/yyyy"
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">Tipo de Exame</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tipoExame"
                    value={documento.tipoExame || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">Laboratório</label>
                  <input
                    type="text"
                    className="form-control"
                    name="laboratorio"
                    value={documento.laboratorio || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Resultado</label>
                  <textarea
                    className="form-control"
                    name="resultado"
                    value={documento.resultado || ""}
                    onChange={handleChange}
                    rows="5"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "R":
        return (
          <>
            <div className="card mb-3">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0"><FaFileAlt /> Receita Médica</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label">Data da Receita*</label>
                    <DatePicker
                      selected={documento.dataReceita}
                      onChange={(date) => handleDateChange(date, "dataReceita")}
                      className="form-control"
                      dateFormat="dd/MM/yyyy"
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label">CRM/MS*</label>
                    <input
                      type="text"
                      className="form-control"
                      name="crmMedico"
                      value={documento.crmMedico || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Médico*</label>
                    <input
                      type="text"
                      className="form-control"
                      name="medico"
                      value={documento.medico || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Observações</label>
                    <textarea
                      className="form-control"
                      name="observacoes"
                      value={documento.observacoes || ""}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0"><FaPills /> Medicamentos</h5>
              </div>
              <div className="card-body">
                {documento.medicamentos.length === 0 ? (
                  <div className="alert alert-info mb-0">Nenhum medicamento prescrito</div>
                ) : (
                  <div className="list-group">
                    {documento.medicamentos.map((med) => (
                      <div key={med.id} className="list-group-item">
                        {editingMedId === med.id ? (
                          <div className="row g-2">
                            <div className="col-12 col-md-5">
                              <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Nome*"
                                name="nome"
                                value={medicamentoEdit.nome}
                                onChange={handleMedicamentoEditChange}
                                required
                              />
                            </div>
                            <div className="col-12 col-md-3">
                              <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Quantidade*"
                                name="quantidade"
                                value={medicamentoEdit.quantidade}
                                onChange={handleMedicamentoEditChange}
                                required
                              />
                            </div>
                            <div className="col-12 col-md-3">
                              <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Forma de uso*"
                                name="formaDeUso"
                                value={medicamentoEdit.formaDeUso}
                                onChange={handleMedicamentoEditChange}
                                required
                              />
                            </div>
                            <div className="col-12 col-md-1 d-flex gap-2">
                              <button
                                type="button"
                                className="btn btn-success flex-grow-1"
                                onClick={salvarEdicaoMedicamento}
                              >
                                <FaCheck />
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary flex-grow-1"
                                onClick={cancelarEdicaoMedicamento}
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="flex-grow-1">
                              <strong>{med.nome}</strong> - {med.quantidade} ({med.formaDeUso})
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              onClick={() => iniciarEdicaoMedicamento(med)}
                            >
                              <FaEdit />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        );

      default:
        return <div className="alert alert-danger">Tipo de documento não suportado</div>;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Nav />

      {notification.show && (
        <div className={`alert alert-${notification.type} fixed-top m-3`}>
          {notification.message}
        </div>
      )}

      <main className="container py-4 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary">
            <i className="me-2">
              {tipo === "D" ? <FaFileAlt /> : tipo === "E" ? <FaFlask /> : <FaPills />}
            </i>
            Editar {tipo === "D" ? "Documento Clínico" : tipo === "E" ? "Exame" : "Receita"}
          </h2>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/meus-documentos")}
            disabled={loading}
          >
            <FaArrowLeft className="me-1" /> Voltar
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {renderImagePreview()}
          {renderFormByType()}

          {/* Campos comuns a todos os tipos */}
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0"><FaStickyNote /> Informações Adicionais</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Resumo</label>
                <textarea
                  className="form-control"
                  name="resumo"
                  value={documento.resumo || ""}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Observações</label>
                <textarea
                  className="form-control"
                  name="observacoes"
                  value={documento.observacoes || ""}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Salvando...
                </>
              ) : (
                <>
                  <FaSave className="me-2" /> Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}