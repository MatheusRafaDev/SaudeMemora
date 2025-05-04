// components/OCRUploader.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
const OCRUploader = ({ imagem, textoOCR, onFileChange, onExecutarOCR, onAplicarOCR }) => (
  <>
    <div className="mb-3">
      <input type="file" accept="image/*" onChange={onFileChange} className="form-control" />
    </div>

    <div className="mb-3 d-flex flex-column flex-sm-row gap-2">
      <button type="button" className="btn btn-primary w-100" onClick={onExecutarOCR}>Executar OCR</button>
      <button type="button" className="btn btn-success w-100" onClick={onAplicarOCR}>Aplicar OCR</button>
    </div>

    <div className="mb-3">
      <label className="form-label">Texto Extraído pelo OCR:</label>
      <textarea className="form-control" rows="5" value={textoOCR} readOnly />
    </div>
  </>
);

export default OCRUploader;
