import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaSave } from 'react-icons/fa';

import DocumentoClinicoForm from '../components/forms/DocumentoClinicoForm';
import ExameForm from '../components/forms/ExameForm';
import ReceitaForm from '../components/forms/ReceitaForm';

import Notification from '../components/Notification';
import Nav from '../components/Nav';
import DocumentoService from '../services/DocumentoService';
import DocumentoClinicoService from '../services/DocumentoClinicoService';
import ExameService from '../services/ExameService';
import ReceitaService from '../services/ReceitaService';
import MedicamentoService from '../services/MedicamentoService';

const AlterarDocumento = () => {
  const navigate = useNavigate();
  const { tipo, id } = useParams();

  // Estado inicial ajustado para corresponder aos formulários filhos
  const [formData, setFormData] = useState({
    // Campos comuns a todos os documentos
    idPaciente: '',
    tipo: tipo,
    resumo: '',
    observacoes: '',
    
    // Campos específicos para cada tipo
    ...(tipo === 'documentoclinico' && {
      tipoDoc: '',
      data: null,
      medico: '',
      crm: '',
      instituicao: '',
      especialidade: '',
      descricao: ''
    }),
    ...(tipo === 'exame' && {
      nomeExame: '',
      tipoExame: '',
      laboratorio: '',
      data: null,
      resultado: ''
    }),
    ...(tipo === 'receita' && {
      dataReceita: null,
      medico: '',
      crmMedico: '',
      medicamentos: []
    })
  });

  const [medicamentoEdit, setMedicamentoEdit] = useState({ 
    nome: '', 
    quantidade: '', 
    formaDeUso: '' 
  });
  const [editingMedId, setEditingMedId] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const carregarDocumento = async () => {
      try {
        let response;
        
        // Carrega os dados específicos do tipo de documento
        switch(tipo) {
          case 'documentoclinico':
            response = await DocumentoClinicoService.getById(id);
            break;
          case 'exame':
            response = await ExameService.getById(id);
            break;
          case 'receita':
            response = await ReceitaService.getById(id);
            if (response.success) {
              const medsResponse = await MedicamentoService.getMedicamentosByReceitaId(id);
              if (medsResponse.success) {
                response.data.medicamentos = medsResponse.data;
              }
            }
            break;
          default:
            throw new Error('Tipo de documento não suportado');
        }

        if (response.success) {
          setFormData(prev => ({
            ...prev,
            ...response.data,
            // Garante que as datas sejam objetos Date
            ...(response.data.data && { data: new Date(response.data.data) }),
            ...(response.data.dataReceita && { dataReceita: new Date(response.data.dataReceita) })
          }));
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        setNotification({ 
          show: true, 
          message: `Erro ao carregar documento: ${error.message}`, 
          type: 'error' 
        });
      }
    };

    carregarDocumento();
  }, [tipo, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };

  const handleMedicamentoChange = (e) => {
    const { name, value } = e.target;
    setMedicamentoEdit(prev => ({ ...prev, [name]: value }));
  };

  const onAddMedicamento = () => {
    if (!medicamentoEdit.nome || !medicamentoEdit.quantidade || !medicamentoEdit.formaDeUso) {
      setNotification({
        show: true,
        message: 'Preencha todos os campos do medicamento',
        type: 'warning'
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      medicamentos: [...prev.medicamentos, {
        ...medicamentoEdit,
        id: Date.now() // ID temporário para edição
      }]
    }));
    setMedicamentoEdit({ nome: '', quantidade: '', formaDeUso: '' });
  };

  const onRemoveMedicamento = (id) => {
    setFormData(prev => ({
      ...prev,
      medicamentos: prev.medicamentos.filter(med => med.id !== id)
    }));
  };

  const onStartEdit = (medicamento) => {
    setMedicamentoEdit(medicamento);
    setEditingMedId(medicamento.id);
  };

  const onSaveEdit = () => {
    setFormData(prev => ({
      ...prev,
      medicamentos: prev.medicamentos.map(med => 
        med.id === editingMedId ? medicamentoEdit : med
      )
    }));
    setMedicamentoEdit({ nome: '', quantidade: '', formaDeUso: '' });
    setEditingMedId(null);
  };

  const onCancelEdit = () => {
    setMedicamentoEdit({ nome: '', quantidade: '', formaDeUso: '' });
    setEditingMedId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      const dadosParaEnviar = { ...formData };

      // Remove campos não necessários para o backend
      delete dadosParaEnviar.id;
      delete dadosParaEnviar.createdAt;
      delete dadosParaEnviar.updatedAt;

      switch(tipo) {
        case 'documentoclinico':
          response = await DocumentoClinicoService.update(id, dadosParaEnviar);
          break;
        case 'exame':
          response = await ExameService.update(id, dadosParaEnviar);
          break;
        case 'receita':
          // Primeiro atualiza a receita
          const { medicamentos, ...receitaData } = dadosParaEnviar;
          response = await ReceitaService.update(id, receitaData);
          
          // Depois atualiza os medicamentos
          if (response.success) {
            // Remove todos os medicamentos existentes e adiciona os novos
            await MedicamentoService.deleteByReceitaId(id);
            
            for (const med of medicamentos) {
              await MedicamentoService.create({
                ...med,
                receitaId: id
              });
            }
          }
          break;
        default:
          throw new Error('Tipo de documento não suportado');
      }

      if (response.success) {
        setNotification({ 
          show: true, 
          message: 'Documento atualizado com sucesso!', 
          type: 'success' 
        });
        setTimeout(() => navigate('/meus-documentos'), 2000);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setNotification({ 
        show: true, 
        message: `Erro ao atualizar documento: ${error.message}`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const renderFormByType = () => {
    switch (tipo) {
      case 'documentoclinico':
        return (
          <DocumentoClinicoForm
            data={formData}
            onChange={handleChange}
            onDateChange={(date, field) => handleDateChange(date, field)}
          />
        );
      case 'exame':
        return (
          <ExameForm
            data={formData}
            onChange={handleChange}
            onDateChange={(date, field) => handleDateChange(date, field)}
          />
        );
      case 'receita':
        return (
          <ReceitaForm
            data={formData}
            medicamentoEdit={medicamentoEdit}
            editingMedId={editingMedId}
            onChange={handleChange}
            onDateChange={(date, field) => handleDateChange(date, field)}
            onMedicamentoChange={handleMedicamentoChange}
            onAddMedicamento={onAddMedicamento}
            onRemoveMedicamento={onRemoveMedicamento}
            onStartEdit={onStartEdit}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
          />
        );
      default:
        return <p className="text-danger">Tipo de documento não reconhecido: {tipo}</p>;
    }
  };

  return (
    <div className="container mt-4">
      <Nav />
      <h2 className="mb-4">
        <FaEdit className="me-2" />
        Alterar Documento - {tipo}
      </h2>

      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}

      <form onSubmit={handleSubmit}>
        {/* Campos comuns a todos os documentos */}
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0">Informações Gerais</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">ID do Paciente</label>
                <input
                  type="text"
                  className="form-control"
                  name="idPaciente"
                  value={formData.idPaciente}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>

              <div className="col-12">
                <label className="form-label">Resumo</label>
                <textarea
                  className="form-control"
                  name="resumo"
                  value={formData.resumo}
                  onChange={handleChange}
                  rows="2"
                />
              </div>

              <div className="col-12">
                <label className="form-label">Observações</label>
                <textarea
                  className="form-control"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  rows="2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Formulário específico do tipo de documento */}
        {renderFormByType()}

        <div className="mt-4 d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/meus-documentos")}
          >
            <FaArrowLeft className="me-2" />
            Voltar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : (
              <FaSave className="me-2" />
            )}
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AlterarDocumento;