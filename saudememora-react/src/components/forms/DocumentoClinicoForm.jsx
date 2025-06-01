import React from "react";
import { FaUserMd, FaHospital, FaCalendarAlt,FaFileAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DocumentoClinicoForm = ({ data, onChange, onDateChange }) => {
  return (
    <div className="card mb-4">
      <div className="card-header bg-light">
        <h5 className="mb-0"><FaFileAlt /> Documento Clínico</h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Tipo de Documento</label>
            <select
              className="form-select"
              name="tipoDoc"
              value={data.tipoDoc}
              onChange={onChange}
              required
            >
              <option value="">Selecione...</option>
              <option value="Atestado">Atestado</option>
              <option value="Relatório">Relatório</option>
              <option value="Laudo">Laudo</option>
              <option value="Prontuário">Prontuário</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">
              <FaCalendarAlt className="me-1" /> Data do Documento
            </label>
            <DatePicker
              selected={data.data}
              onChange={(date) => onDateChange(date, "data")}
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
            <label className="form-label">CRM</label>
            <input
              type="text"
              className="form-control"
              name="crm"
              value={data.crm}
              onChange={onChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              <FaHospital className="me-1" /> Instituição
            </label>
            <input
              type="text"
              className="form-control"
              name="instituicao"
              value={data.instituicao}
              onChange={onChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Especialidade</label>
            <input
              type="text"
              className="form-control"
              name="especialidade"
              value={data.especialidade}
              onChange={onChange}
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label">Descrição</label>
            <textarea
              className="form-control"
              name="descricao"
              value={data.descricao}
              onChange={onChange}
              rows="4"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentoClinicoForm;