// src/components/Pergunta.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
const Pergunta = ({ item, resposta, onChange }) => {
  return (
    <div className="mb-3">
      {item.tipo === 'pressao' ? (
        <>
          <label className="form-label">{item.pergunta}</label>
          <input
            type="text"
            className="form-control"
            value={resposta || ''}
            onChange={e => onChange(item.chave, e.target.value)}
          />
        </>
      ) : (
        <>
          <label className="form-label d-block">{item.pergunta}</label>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name={item.chave}
              value="sim"
              checked={resposta === 'sim'}
              onChange={e => onChange(item.chave, e.target.value)}
            />
            <label className="form-check-label">Sim</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name={item.chave}
              value="nao"
              checked={resposta === 'nao'}
              onChange={e => onChange(item.chave, e.target.value)}
            />
            <label className="form-check-label">Não</label>
          </div>
        </>
      )}
    </div>
  );
};

export default Pergunta;
