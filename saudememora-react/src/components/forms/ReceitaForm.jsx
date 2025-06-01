import React from "react";
import { FaPills, FaCalendarAlt, FaUserMd, FaPlus, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReceitaForm = ({
  data,
  medicamentoEdit,
  editingMedId,
  onChange,
  onDateChange,
  onMedicamentoChange,
  onAddMedicamento,
  onRemoveMedicamento,
  onStartEdit,
  onSaveEdit,
  onCancelEdit
}) => {
  return (
    <div className="card mb-4">
      <div className="card-header bg-light">
        <h5 className="mb-0"><FaPills /> Receita Médica</h5>
      </div>
      <div className="card-body">
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label">
              <FaCalendarAlt className="me-1" /> Data da Receita
            </label>
            <DatePicker
              selected={data.dataReceita}
              onChange={(date) => onDateChange(date, "dataReceita")}
              className="form-control"
              dateFormat="dd/MM/yyyy"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              <FaUserMd className="me-1" /> Médico
            </label>
            <input
              type="text"
              className="form-control"
              name="medico"
              value={data.medico}
              onChange={onChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">CRM do Médico</label>
            <input
              type="text"
              className="form-control"
              name="crmMedico"
              value={data.crmMedico}
              onChange={onChange}
              required
            />
          </div>
        </div>

        <div className="border-top pt-3">
          <h5 className="mb-3"><FaPills /> Medicamentos</h5>
          
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                name="nome"
                value={medicamentoEdit.nome}
                onChange={onMedicamentoChange}
                placeholder="Nome do medicamento"
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Quantidade</label>
              <input
                type="text"
                className="form-control"
                name="quantidade"
                value={medicamentoEdit.quantidade}
                onChange={onMedicamentoChange}
                placeholder="Ex: 1 caixa, 30 comprimidos"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Forma de Uso</label>
              <input
                type="text"
                className="form-control"
                name="formaDeUso"
                value={medicamentoEdit.formaDeUso}
                onChange={onMedicamentoChange}
                placeholder="Ex: 1x ao dia"
              />
            </div>
            <div className="col-md-1 d-flex align-items-end">
              {editingMedId === null ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onAddMedicamento}
                >
                  <FaPlus />
                </button>
              ) : (
                <div className="d-flex gap-1">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={onSaveEdit}
                  >
                    <FaCheck />
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={onCancelEdit}
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>
          </div>

          {data.medicamentos.length > 0 && (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Quantidade</th>
                    <th>Forma de Uso</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.medicamentos.map((med) => (
                    <tr key={med.id}>
                      <td>{med.nome}</td>
                      <td>{med.quantidade}</td>
                      <td>{med.formaDeUso}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => onStartEdit(med)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => onRemoveMedicamento(med.id)}
                        >
                          <FaTimes />
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
    </div>
  );
};

export default ReceitaForm;