import React, { useState, useEffect } from "react";
import { Form, Spinner, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import DocumentoClinicoService from "../../services/DocumentoClinicoService";
import ptBR from 'date-fns/locale/pt-BR';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  FaFileAlt,
  FaFileMedical,
  FaCalendarAlt,
  FaUserMd,
  FaSave,
  FaArrowLeft,
  FaStickyNote,
  FaInfoCircle,
} from "react-icons/fa";

// Registrar o locale pt-BR
registerLocale('pt-BR', ptBR);

const documentoClinicoModel = {
  id: null,
  tipo: "",
  medico: "",
  dataDocumentoCli: null,
  observacoes: "",
  imagem: null,
  resumo: "",
  conclusoes: "",
  conteudo: "",
  especialidade: "",
};

const DocumentoClinicoForm = ({ data: initialData, isLoading = false }) => {
  const [data, setData] = useState(documentoClinicoModel);
  const [loading, setLoading] = useState(false);
  const [dateInputValue, setDateInputValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      const mappedData = {
        ...documentoClinicoModel,
        ...initialData,
        dataDocumentoCli: initialData.dataDocumentoCli ? new Date(initialData.dataDocumentoCli) : null
      };
      setData(mappedData);
      if (mappedData.dataDocumentoCli) {
        setDateInputValue(mappedData.dataDocumentoCli.toLocaleDateString('pt-BR'));
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setData(prev => ({ ...prev, dataDocumentoCli: date }));
    setDateInputValue(date ? date.toLocaleDateString('pt-BR') : '');
  };

  const handleDateInputChange = (e) => {
    const value = e.target.value;
    setDateInputValue(value);
    
    const parts = value.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const newDate = new Date(year, month, day);
        if (!isNaN(newDate.getTime())) {
          setData(prev => ({ ...prev, dataDocumentoCli: newDate }));
          return;
        }
      }
    }
    
    if (value === '') {
      setData(prev => ({ ...prev, dataDocumentoCli: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const documentoToSave = {
        ...data,
        dataDocumentoCli: data.dataDocumentoCli ? data.dataDocumentoCli.toISOString() : null
      };

      console.log("Documento a ser salvo:", documentoToSave);
      await DocumentoClinicoService.update(documentoToSave.id, documentoToSave);
      
      navigate("/meus-documentos");

    } catch (error) {
      console.error("Falha na atualização:", error);
      alert(`Erro ao atualizar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto px-3" style={{ maxWidth: "900px" }}>
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header d-flex align-items-center justify-content-between bg-white border-bottom py-3">
          <h2 className="mb-0 fs-5 fw-bold">
            {data.id ? "Editar Documento" : "Novo Documento Clínico"}
          </h2>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => navigate("/meus-documentos")}
            disabled={loading}
          >
            <FaArrowLeft className="me-1" /> Voltar
          </Button>
        </div>

        {data.imagem && (
          <div className="border-top bg-light" style={{ height: "350px", overflow: "hidden" }}>
            <TransformWrapper initialScale={1} minScale={1} maxScale={5} wheel={{ step: 0.1 }}>
              <TransformComponent
                wrapperStyle={{ width: "100%", height: "100%" }}
                contentStyle={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={`http://localhost:7070/api/documentosclinicos/imagem/${data.id}`}
                  alt="Imagem do documento"
                  className="img-fluid rounded shadow"
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                    cursor: "grab",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/imagem-padrao.png";
                  }}
                />
              </TransformComponent>
            </TransformWrapper>
          </div>
        )}

        <div className="card-body">
          {isLoading && (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 mb-0 fs-5">Carregando documento...</p>
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <div className="row g-3" style={{ opacity: isLoading ? 0.5 : 1 }}>

              <div className="col-md-6">
                <Form.Group controlId="tipo">
                  <Form.Label>
                    <FaFileMedical className="me-1 text-primary" /> Tipo de Documento
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="tipo"
                    value={data.tipo}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group controlId="medico">
                  <Form.Label>
                    <FaUserMd className="me-1 text-primary" /> Médico
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="medico"
                    value={data.medico}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group controlId="especialidade">
                  <Form.Label>
                    <FaInfoCircle className="me-1 text-primary" /> Especialidade
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="especialidade"
                    value={data.especialidade}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group controlId="dataDocumentoCli">
                  <Form.Label>
                    <FaCalendarAlt className="me-1 text-primary" /> Data
                  </Form.Label>
                  <DatePicker
                    selected={data.dataDocumentoCli}
                    onChange={handleDateChange}
                    onChangeRaw={handleDateInputChange}
                    value={dateInputValue}
                    className="form-control"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/AAAA"
                    required
                    disabled={loading}
                    locale="pt-BR"
                    showYearDropdown
                    dropdownMode="select"
                  />
                </Form.Group>
              </div>

              <div className="col-12">
                <Form.Group controlId="conclusoes">
                  <Form.Label>Conclusões</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="conclusoes"
                    value={data.conclusoes}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Form.Group>
              </div>

              <div className="col-12">
                <Form.Group controlId="observacoes">
                  <Form.Label>Observações</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="observacoes"
                    value={data.observacoes}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Form.Group>
              </div>

              <div className="col-12">
                <Form.Group controlId="resumo">
                  <Form.Label>Resumo</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="resumo"
                    value={data.resumo}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="d-flex justify-content-center mt-4">
              <Button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading || isLoading}
                style={{ minWidth: "200px" }}
              >
                {loading ? (
                  <>
                    <Spinner as="span" size="sm" animation="border" role="status" />
                    <span className="ms-2">Salvando...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" />
                    Salvar
                  </>
                )}
              </Button>
            </div>

          </Form>
        </div>
      </div>
    </div>
  );
};

export default DocumentoClinicoForm;