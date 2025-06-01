import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { 
  FaCalendarAlt, FaFileAlt, FaUserMd, FaHospital, FaInfoCircle, 
  FaStickyNote, FaArrowLeft, FaSave, FaFlask, FaNotesMedical,
  FaFileMedical, FaPills, FaAward, FaEdit, FaCheck, FaTimes, 
  FaImage, FaSearchPlus, FaSearchMinus, FaUndo
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DocumentoClinicoService from "../services/DocumentoClinicoService";
import ExameService from "../services/ExameService";
import ReceitaService from "../services/ReceitaService";
import DocumentoService from "../services/DocumentoService";
import Nav from "../components/Nav";

// Componentes separados
import DocumentoClinicoForm from "../components/forms/DocumentoClinicoForm";
import ExameForm from "../components/forms/ExameForm";
import ReceitaForm from "../components/forms/ReceitaForm";
import ImagePreview from "../components/ImagePreview";
import Notification from "../components/Notification";

const AlterarDocumento = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Estado inicial organizado por tipos
  const initialState = {
    base: {
      id: null,
      idPaciente: "",
      dataUpload: new Date(),
      imagem: null,
      imagemUrl: null
    },
    documentoClinico: {
      tipoDoc: "",
      data: new Date(),
      medico: "",
      crm: "",
      instituicao: "",
      especialidade: "",
      descricao: ""
    },
    exame: {
      nomeExame: "",
      tipoExame: "",
      laboratorio: "",
      resultado: "",
      data: new Date()
    },
    receita: {
      dataReceita: new Date(),
      medico: "",
      crmMedico: "",
      medicamentos: []
    },
    comum: {
      resumo: "",
      observacoes: ""
    }
  };

  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [editingMedId, setEditingMedId] = useState(null);
  const [medicamentoEdit, setMedicamentoEdit] = useState({ nome: "", quantidade: "", formaDeUso: "" });

  // Extrai o tipo do documento da URL ou state
  const tipo = location.state?.tipo || new URLSearchParams(location.search).get('tipo');
  const documentoId = location.state?.documentoId || new URLSearchParams(location.search).get('id');

  // Carrega os dados do documento
  useEffect(() => {
    if (!tipo || !documentoId) {
      navigate("/meus-documentos");
      return;
    }

    const carregarDocumento = async () => {
      try {
        setLoading(true);
        
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
          const { data } = response;
          setState({
            base: {
              id: data.id,
              idPaciente: data.idPaciente,
              dataUpload: new Date(data.dataUpload),
              imagemUrl: data.imagemUrl
            },
            documentoClinico: tipo === "D" ? {
              tipoDoc: data.tipoDoc,
              data: new Date(data.data),
              medico: data.medico,
              crm: data.crm,
              instituicao: data.instituicao,
              especialidade: data.especialidade,
              descricao: data.descricao
            } : initialState.documentoClinico,
            exame: tipo === "E" ? {
              nomeExame: data.nomeExame,
              tipoExame: data.tipoExame,
              laboratorio: data.laboratorio,
              resultado: data.resultado,
              data: new Date(data.data)
            } : initialState.exame,
            receita: tipo === "R" ? {
              dataReceita: new Date(data.dataReceita),
              medico: data.medico,
              crmMedico: data.crmMedico,
              medicamentos: data.medicamentos || []
            } : initialState.receita,
            comum: {
              resumo: data.resumo || "",
              observacoes: data.observacoes || ""
            }
          });
        } else {
          throw new Error(response.message || "Erro ao carregar documento");
        }
      } catch (error) {
        showNotification(error.message, "error");
        navigate("/meus-documentos");
      } finally {
        setLoading(false);
      }
    };

    carregarDocumento();
  }, [tipo, documentoId, navigate]);

  // Funções auxiliares
  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 5000);
  };

  const handleBaseChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, base: { ...prev.base, [name]: value } }));
  };

  const handleComumChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, comum: { ...prev.comum, [name]: value } }));
  };

  const handleDateChange = (date, field, section) => {
    setState(prev => ({ ...prev, [section]: { ...prev[section], [field]: date } }));
  };

  // Manipulação de medicamentos
  const handleMedicamentoChange = (e) => {
    const { name, value } = e.target;
    setMedicamentoEdit(prev => ({ ...prev, [name]: value }));
  };

  const adicionarMedicamento = () => {
    if (!medicamentoEdit.nome || !medicamentoEdit.quantidade || !medicamentoEdit.formaDeUso) {
      showNotification("Preencha todos os campos do medicamento", "warning");
      return;
    }

    setState(prev => ({
      ...prev,
      receita: {
        ...prev.receita,
        medicamentos: [...prev.receita.medicamentos, { ...medicamentoEdit, id: Date.now() }]
      }
    }));

    setMedicamentoEdit({ nome: "", quantidade: "", formaDeUso: "" });
  };

  const removerMedicamento = (id) => {
    setState(prev => ({
      ...prev,
      receita: {
        ...prev.receita,
        medicamentos: prev.receita.medicamentos.filter(med => med.id !== id)
      }
    }));
  };

  // Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Dados comuns a todos os tipos
      const documentoCompleto = {
        ...state.base,
        ...state.comum,
        ...(tipo === "D" ? state.documentoClinico : {}),
        ...(tipo === "E" ? state.exame : {}),
        ...(tipo === "R" ? state.receita : {})
      };

      let response;
      switch (tipo) {
        case "D":
          response = await DocumentoClinicoService.update(documentoId, documentoCompleto);
          break;
        case "E":
          response = await ExameService.update(documentoId, documentoCompleto);
          break;
        case "R":
          response = await ReceitaService.update(documentoId, documentoCompleto);
          break;
      }

      if (response.success) {
        showNotification("Documento atualizado com sucesso!", "success");
        navigate("/meus-documentos");
      } else {
        throw new Error(response.message || "Erro ao atualizar documento");
      }
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Renderização condicional do formulário
  const renderFormByType = () => {
    switch (tipo) {
      case "D":
        return (
          <DocumentoClinicoForm
            data={state.documentoClinico}
            onDateChange={(date, field) => handleDateChange(date, field, 'documentoClinico')}
            onChange={(e) => setState(prev => ({ ...prev, documentoClinico: { ...prev.documentoClinico, [e.target.name]: e.target.value } }))}
          />
        );
      case "E":
        return (
          <ExameForm
            data={state.exame}
            onDateChange={(date, field) => handleDateChange(date, field, 'exame')}
            onChange={(e) => setState(prev => ({ ...prev, exame: { ...prev.exame, [e.target.name]: e.target.value } }))}
          />
        );
      case "R":
        return (
          <ReceitaForm
            data={state.receita}
            medicamentoEdit={medicamentoEdit}
            editingMedId={editingMedId}
            onDateChange={(date, field) => handleDateChange(date, field, 'receita')}
            onChange={(e) => setState(prev => ({ ...prev, receita: { ...prev.receita, [e.target.name]: e.target.value } }))}
            onMedicamentoChange={handleMedicamentoChange}
            onAddMedicamento={adicionarMedicamento}
            onRemoveMedicamento={removerMedicamento}
            onStartEdit={(med) => {
              setEditingMedId(med.id);
              setMedicamentoEdit({
                nome: med.nome,
                quantidade: med.quantidade,
                formaDeUso: med.formaDeUso
              });
            }}
            onSaveEdit={() => {
              setState(prev => ({
                ...prev,
                receita: {
                  ...prev.receita,
                  medicamentos: prev.receita.medicamentos.map(med => 
                    med.id === editingMedId ? { ...med, ...medicamentoEdit } : med
                  )
                }
              }));
              setEditingMedId(null);
              setMedicamentoEdit({ nome: "", quantidade: "", formaDeUso: "" });
            }}
            onCancelEdit={() => {
              setEditingMedId(null);
              setMedicamentoEdit({ nome: "", quantidade: "", formaDeUso: "" });
            }}
          />
        );
      default:
        return <div className="alert alert-danger">Tipo de documento não suportado</div>;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Nav />

      <Notification 
        show={notification.show} 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ show: false, message: "", type: "" })}
      />

      <main className="container py-4 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary">
            {tipo === "D" ? <FaFileAlt /> : tipo === "E" ? <FaFlask /> : <FaPills />}
            {` Editar ${tipo === "D" ? "Documento Clínico" : tipo === "E" ? "Exame" : "Receita"}`}
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
          <ImagePreview 
            imageUrl={state.base.imagemUrl} 
            tipo={tipo} 
            documentoId={state.base.id}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setState(prev => ({ ...prev, base: { ...prev.base, imagem: file } }));
              }
            }}
          />

          {renderFormByType()}

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
                  value={state.comum.resumo}
                  onChange={handleComumChange}
                  rows="3"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Observações</label>
                <textarea
                  className="form-control"
                  name="observacoes"
                  value={state.comum.observacoes}
                  onChange={handleComumChange}
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
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
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
};

export default AlterarDocumento;