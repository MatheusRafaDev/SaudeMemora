import React from "react";
import { FaFlask, FaCalendarAlt, FaClinicMedical } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ExameForm = ({ data, onChange, onDateChange }) => {
  return (
    <div className="card mb-4">
      <div className="card-header bg-light">
        <h5 className="mb-0"><FaFlask /> Exame Médico</h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nome do Exame</label>
            <input
              type="text"
              className="form-control"
              name="nomeExame"
              value={data.nomeExame}
              onChange={onChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Tipo de Exame</label>
            <select
              className="form-select"
              name="tipoExame"
              value={data.tipoExame}
              onChange={onChange}
              required
            >
              <option value="">Selecione...</option>
              <option value="Laboratorial">Laboratorial</option>
              <option value="Imagem">Imagem</option>
              <option value="Físico">Físico</option>
              <option value="Genético">Genético</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">
              <FaClinicMedical className="me-1" /> Laboratório/Clínica
            </label>
            <input
              type="text"
              className="form-control"
              name="laboratorio"
              value={data.laboratorio}
              onChange={onChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              <FaCalendarAlt className="me-1" /> Data do Exame
            </label>
            <DatePicker
              selected={data.data}
              onChange={(date) => onDateChange(date, "data")}
              className="form-control"
              dateFormat="dd/MM/yyyy"
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label">Resultado</label>
            <textarea
              className="form-control"
              name="resultado"
              value={data.resultado}
              onChange={onChange}
              rows="6"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExameForm;