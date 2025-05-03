import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ocrSpace } from '../ocr/ocrSpace'; 
import { aplicarCamposComOCR } from '../ocr/aplicarCamposComOCR'; 

const perguntas = [
  { chave: 'tratamento', pergunta: 'Está em tratamento médico?' },
  { chave: 'gravida', pergunta: 'Está grávida?' },
  { chave: 'regime', pergunta: 'Está fazendo algum regime?' },
  { chave: 'diabetes', pergunta: 'Possui diabetes?' },
  { chave: 'alergias', pergunta: 'Tem alergias?' },
  { chave: 'reumatica', pergunta: 'Teve febre reumática?' },
  { chave: 'coagulacao', pergunta: 'Tem problemas de coagulação?' },
  { chave: 'cardio', pergunta: 'Possui doença cárdio vascular?' },
  { chave: 'hemorragicos', pergunta: 'Tem problemas hemorrágicos?' },
  { chave: 'anestesia', pergunta: 'Já teve problemas com anestesia?' },
  { chave: 'alergiaMedicamento', pergunta: 'Tem alergia a medicamentos?' },
  { chave: 'hepatite', pergunta: 'Já teve hepatite?' },
  { chave: 'hiv', pergunta: 'É portador do vírus HIV?' },
  { chave: 'drogas', pergunta: 'Usa ou já usou drogas?' },
  { chave: 'fumante', pergunta: 'É fumante?' },
  { chave: 'jaFumou', pergunta: 'Já fumou?' },
  { chave: 'pressao', pergunta: 'Como está sua pressão arterial?', tipo: 'pressao' },
  { chave: 'respiratorio', pergunta: 'Tem problemas respiratórios?' },
];


const FormularioMedico = () => {
  const [respostas, setRespostas] = useState({});
  const [imagem, setImagem] = useState(null);
  const [textoOCR, setTextoOCR] = useState('');
  const [ocrExecutado, setOcrExecutado] = useState(false);

  const handleFileChange = e => {
    setImagem(e.target.files[0]);
    setOcrExecutado(false);
  };

  const executarOCR = async () => {
    if (!imagem) return alert('Carregue uma imagem primeiro.');
    const texto = await ocrSpace(imagem);

    setTextoOCR(texto || '');
    setOcrExecutado(true);
  };

  const handleAplicarOCR = () => {
    aplicarCamposComOCR(textoOCR, perguntas, setRespostas, ocrExecutado);
  };

  const handleChange = (chave, valor) => {
    setRespostas(prev => ({ ...prev, [chave]: valor }));
  };

  const handleExtraChange = (chave, valor) => {
    setRespostas(prev => ({ ...prev, [chave + '_extra']: valor }));
  };

  return (
    <div className="container mt-5">
      <div className="saude-card shadow-sm">
        <h4 className="mb-4">Informações de Saúde</h4>
        <form>
          <div className="mb-4">
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <div className="mb-4 d-flex gap-3">
            <button type="button" className="btn btn-primary" onClick={executarOCR}>
              Executar OCR
            </button>
            <button type="button" className="btn btn-success" onClick={handleAplicarOCR}>
              Aplicar OCR
            </button>
          </div>
          <div className="mb-4">
            <label htmlFor="textoOCR" className="form-label">Texto Extraído pelo OCR:</label>
            <textarea id="textoOCR" className="form-control" rows="5" value={textoOCR} readOnly />
          </div>
          {perguntas.map(item => (
            <div key={item.chave} className="mb-4 border-bottom pb-3">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <label className="form-label pergunta-label">{item.pergunta}</label>
                </div>
                <div className="col-md-6">
                  {item.tipo === 'pressao' ? (
                    <select className="form-select" value={respostas.pressao || ''} onChange={e => handleChange('pressao', e.target.value)}>
                      <option value="">Selecione</option>
                      <option value="NORMAL">NORMAL</option>
                      <option value="ALTA">ALTA</option>
                      <option value="BAIXA">BAIXA</option>
                    </select>
                  ) : (
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input className="form-check-input" type="radio" id={`${item.chave}-sim`} name={item.chave} value="SIM" checked={respostas[item.chave] === 'SIM'} onChange={() => handleChange(item.chave, 'SIM')} />
                        <label className="form-check-label" htmlFor={`${item.chave}-sim`}>Sim</label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" id={`${item.chave}-nao`} name={item.chave} value="NAO" checked={respostas[item.chave] === 'NAO'} onChange={() => handleChange(item.chave, 'NAO')} />
                        <label className="form-check-label" htmlFor={`${item.chave}-nao`}>Não</label>
                      </div>
                    </div>
                  )}
                  {item.extra && respostas[item.chave] === 'SIM' && (
                    <input type="text" className="form-control extra-input mt-2" placeholder={item.extra} value={respostas[item.chave + '_extra'] || ''} onChange={e => handleExtraChange(item.chave, e.target.value)} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </form>
      </div>
    </div>
  );
};

export default FormularioMedico;