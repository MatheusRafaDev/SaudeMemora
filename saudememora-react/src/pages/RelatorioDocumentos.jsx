import React, { useState, useEffect } from "react";
import { FiFileText, FiFilter, FiDownload, FiPrinter } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/RelatorioDocumentos.css";
import DocumentoService from "../services/DocumentoService";
import Nav from "../components/Nav";

const RelatorioDocumentos = () => {
  const [tipo, setTipo] = useState("");
  const [status, setStatus] = useState("");
  const [dataUpload, setDataUpload] = useState("");
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataValida, setDataValida] = useState(true);

  // Carrega os documentos ao montar o componente
  useEffect(() => {
    buscarDocumentos();
  }, []);

  const buscarDocumentos = async () => {
    // Verifica se a data está completa mas inválida
    if (dataUpload.length === 10 && !validarDataCompleta(dataUpload)) {
      setDataValida(false);
      return;
    }
    
    setLoading(true);
    try {
      const resultado = await DocumentoService.listarDocumentos();
      if (resultado.success) {
        let filtrados = resultado.data;

        // Recuperar paciente do localStorage
        const dataPaciente = localStorage.getItem("paciente");
        if (!dataPaciente) {
          alert("Paciente não encontrado no armazenamento local.");
          setDocumentos([]);
          setLoading(false);
          return;
        }

        let paciente = null;
        try {
          paciente = JSON.parse(dataPaciente);
        } catch (err) {
          console.error("Erro ao parsear paciente do localStorage", err);
          alert("Paciente inválido no armazenamento local.");
          setDocumentos([]);
          setLoading(false);
          return;
        }

        // Filtra por paciente (comparando id)
        filtrados = filtrados.filter((doc) => doc.paciente?.id === paciente.id);

        // Aplica filtros adicionais
        if (tipo) {
          filtrados = filtrados.filter((doc) => doc.tipoDocumento === tipo);
        }
        if (status) {
          filtrados = filtrados.filter((doc) => doc.status === status);
        }
        if (dataUpload && dataValida) {
          // Formata a data para comparação
          const dataFiltro = formatarDataParaComparacao(dataUpload);
          if (dataFiltro) {
            filtrados = filtrados.filter((doc) => {
              const dataDoc = new Date(doc.dataUpload).toISOString().split("T")[0];
              return dataDoc === dataFiltro;
            });
          }
        }

        setDocumentos(filtrados);
      } else {
        alert("Erro ao buscar documentos: " + (resultado.message || ""));
      }
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
      alert("Erro inesperado ao buscar documentos.");
    } finally {
      setLoading(false);
    }
  };

  // Formata data dd/mm/yyyy para yyyy-mm-dd (ISO)
  const formatarDataParaComparacao = (data) => {
    const partes = data.split("/");
    if (partes.length === 3) {
      const [dia, mes, ano] = partes;
      // Validação básica da data
      if (dia.length === 2 && mes.length === 2 && ano.length === 4) {
        return `${ano}-${mes}-${dia}`;
      }
    }
    return null;
  };

  // Validação completa da data
  const validarDataCompleta = (data) => {
    if (data.length < 10) return true; // Ainda não está completa
    
    const [day, month, year] = data.split('/').map(Number);
    
    // Valida ano (exemplo: entre 1900 e 2100)
    if (year < 1900 || year > 2100) return false;
    
    // Valida mês
    if (month < 1 || month > 12) return false;
    
    // Valida dia
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > lastDayOfMonth) return false;
    
    return true;
  };

  // Máscara e validação do input de data
  const handleDataUploadChange = (e) => {
    let val = e.target.value;
    
    // Remove caracteres não numéricos exceto /
    val = val.replace(/[^0-9/]/g, '');
    
    // Limita o tamanho
    if (val.length > 10) return;
    
    // Auto-insere as barras
    if (val.length === 2 && e.nativeEvent.inputType !== "deleteContentBackward") {
      val += '/';
    } else if (val.length === 5 && e.nativeEvent.inputType !== "deleteContentBackward") {
      val += '/';
    }
    
    // Validações de dia e mês enquanto digita
    if (val.length >= 2) {
      const day = parseInt(val.substring(0, 2), 10) || 0;
      if (day > 31) {
        val = '31' + val.substring(2);
      }
    }
    
    if (val.length >= 5) {
      const month = parseInt(val.substring(3, 5), 10) || 0;
      if (month > 12) {
        val = val.substring(0, 3) + '12' + val.substring(5);
      }
    }
    
    setDataUpload(val);
    
    // Valida a data quando estiver completa
    if (val.length === 10) {
      setDataValida(validarDataCompleta(val));
    } else {
      setDataValida(true);
    }
  };

  // Função para exportar dados
  const exportarParaExcel = () => {
    // Implementação da exportação para Excel
    alert("Exportar para Excel - funcionalidade em desenvolvimento");
  };

  // Função para exportar PDF
  const exportarParaPDF = () => {
    // Implementação da exportação para PDF
    alert("Exportar para PDF - funcionalidade em desenvolvimento");
  };

  return (
    <div>
      <Nav />
      <div className="container relatorio-container mt-4">
        <h4 className="text-center mb-4">
          <FiFileText /> Relatório de Documentos
        </h4>

        <div className="card filtros-card mb-4">
          <div className="card-header bg-light">
            <FiFilter /> Filtros
          </div>
          <div className="card-body">
            <div className="row">
              {/* Filtro Tipo */}
              <div className="col-md-4">
                <div className="form-group">
                  <label>Tipo:</label>
                  <select
                    className="form-control"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="R">Receita</option>
                    <option value="E">Exame</option>
                    <option value="D">Documento Clínico</option>
                  </select>
                </div>
              </div>

              {/* Filtro Status */}
              <div className="col-md-4">
                <div className="form-group">
                  <label>Status:</label>
                  <select
                    className="form-control"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="Processado">Processado</option>
                    <option value="Em processamento">Em processamento</option>
                  </select>
                </div>
              </div>

              {/* Filtro Data Upload */}
              <div className="col-md-4">
                <div className="form-group">
                  <label>Data Upload (dd/mm/aaaa):</label>
                  <input
                    type="text"
                    className={`form-control ${!dataValida && dataUpload.length === 10 ? 'is-invalid' : ''}`}
                    placeholder="dd/mm/aaaa"
                    value={dataUpload}
                    onChange={handleDataUploadChange}
                    maxLength={10}
                  />
                  {!dataValida && dataUpload.length === 10 && (
                    <div className="invalid-feedback">
                      Por favor, insira uma data válida.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center mt-3">
              <button 
                className="btn btn-primary" 
                onClick={buscarDocumentos}
                disabled={loading || (!dataValida && dataUpload.length === 10)}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Carregando...
                  </>
                ) : (
                  "Aplicar Filtros"
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end mb-3">
          <div className="btn-group">
            <button 
              className="btn btn-outline-secondary"
              onClick={exportarParaExcel}
              disabled={documentos.length === 0}
            >
              <FiDownload /> Exportar Excel
            </button>
            <button 
              className="btn btn-outline-secondary"
              onClick={exportarParaPDF}
              disabled={documentos.length === 0}
            >
              <FiPrinter /> Exportar PDF
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center mt-4">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Carregando...</span>
            </div>
          </div>
        ) : documentos.length === 0 ? (
          <div className="alert alert-info text-center">
            Nenhum documento encontrado com os filtros selecionados.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>ID</th>
                  <th>Paciente</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Data Upload</th>
                </tr>
              </thead>
              <tbody>
                {documentos.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.id}</td>
                    <td>{doc.paciente?.nome || "Sem nome"}</td>
                    <td>
                      {doc.tipoDocumento === "R"
                        ? "Receita"
                        : doc.tipoDocumento === "E"
                        ? "Exame"
                        : "Documento Clínico"}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          doc.status === "Processado"
                            ? "badge-success"
                            : "badge-warning"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td>{new Date(doc.dataUpload).toLocaleDateString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatorioDocumentos;