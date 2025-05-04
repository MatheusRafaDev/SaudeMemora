import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ocrSpace } from '../ocr/ocrSpace';
import { aplicarCamposComOCR } from '../ocr/aplicarCamposComOCR';
import '../styles/FormularioMedico.css';
import { useLocation } from 'react-router-dom';
import {  cadastrarFichaMedica } from '../services/FichaMedicaService';
import { useNavigate } from 'react-router-dom';

const perguntas = [
  { chave: 'tratamento medico', pergunta: 'Está em tratamento médico?' },
  { chave: 'gravida', pergunta: 'Está grávida?' },
  { chave: 'regime', pergunta: 'Está fazendo algum regime?' },
  { chave: 'diabetes', pergunta: 'Possui diabetes?' },
  { chave: 'alergias', pergunta: 'Tem alergias?' },
  { chave: 'reumatica', pergunta: 'Teve febre reumática?' },
  { chave: 'coagulacao', pergunta: 'Tem problemas de coagulação?' },
  { chave: 'cardio', pergunta: 'Possui doença cárdio vascular?' },
  { chave: 'hemorragicos', pergunta: 'Tem problemas hemorrágicos?' },
  { chave: 'anestesia', pergunta: 'Já teve problemas com anestesia?' },
  { chave: 'alergia a medicamento', pergunta: 'Tem alergia a medicamentos?' },
  { chave: 'hepatite', pergunta: 'Já teve hepatite?' },
  { chave: 'hiv', pergunta: 'É portador do vírus HIV?' },
  { chave: 'drogas', pergunta: 'Usa ou já usou drogas?' },
  { chave: 'fumante', pergunta: 'É fumante?' },
  { chave: 'fumou', pergunta: 'Já fumou?' },
  { chave: 'pressao', pergunta: 'Como está sua pressão arterial?', tipo: 'pressao' },
  { chave: 'respiratorio', pergunta: 'Tem problemas respiratórios?' },
];

const FormularioMedico = () => {
  const [respostas, setRespostas] = useState({});
  const [imagem, setImagem] = useState(null);
  const [textoOCR, setTextoOCR] = useState('');
  const [ocrExecutado, setOcrExecutado] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const location = useLocation();
  const result = location.state || {};
  const navigate = useNavigate();

  const handleFileChange = e => {
    setImagem(e.target.files[0]);
    setOcrExecutado(false);
  };

  const executarOCR = async () => {
    if (!imagem) {
      setMensagem('Carregue uma imagem primeiro.');
      return;
    }
    const texto = await ocrSpace(imagem);
    setTextoOCR(texto || '');
    setOcrExecutado(true);
    setMensagem('');
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

  const todosCamposPreenchidos = () => {
    return perguntas.every(item => {
      if (item.tipo === 'pressao') {
        return respostas[item.chave] && respostas[item.chave] !== '';
      }
      return respostas[item.chave] === 'SIM' || respostas[item.chave] === 'NAO';
    });
  };

  const handleFinalizar = async () => {
    if (!todosCamposPreenchidos()) {
      setMensagem('Preencha todos os campos antes de continuar.');
    } else {

      const formData = {
        respostas,    
        imagem,       
        textoOCR,  
        result,
      };

      const response = await cadastrarFichaMedica(formData); 
      if (response.success) {
        setMensagem(response.message); 
        navigate('/home', { state: result.dados });

      } else {
        setMensagem(response.message); 
      }
    }
  };
  

  return (
    <div className="container mt-4">
      <div className="saude-card shadow-sm p-4 rounded bg-white">
        <h4 className="mb-4 text-center">Informações de Saúde</h4>
        <form>
          <div className="mb-3">
            <input type="file" accept="image/*" onChange={handleFileChange} className="form-control" />
          </div>

          <div className="mb-3 d-flex flex-column flex-sm-row gap-2">
            <button type="button" className="btn btn-primary w-100" onClick={executarOCR}>
              Executar OCR
            </button>
            <button type="button" className="btn btn-success w-100" onClick={handleAplicarOCR}>
              Aplicar OCR
            </button>
          </div>

          <div className="mb-3">
            <label htmlFor="textoOCR" className="form-label">Texto Extraído pelo OCR:</label>
            <textarea id="textoOCR" className="form-control" rows="5" value={textoOCR} readOnly />
          </div>

          {perguntas.map(item => (
            <div key={item.chave} className="mb-4 border-bottom pb-3">
              <div className="row">
                <div className="col-12 col-md-6 mb-2 mb-md-0">
                  <label className="form-label">{item.pergunta}</label>
                </div>
                <div className="col-12 col-md-6">
                  {item.tipo === 'pressao' ? (
                    <select className="form-select" value={respostas.pressao || ''} onChange={e => handleChange('pressao', e.target.value)}>
                      <option value="">Selecione</option>
                      <option value="NORMAL">NORMAL</option>
                      <option value="ALTA">ALTA</option>
                      <option value="BAIXA">BAIXA</option>
                    </select>
                  ) : (
                    <div className="d-flex flex-wrap gap-2">
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
                    <input type="text" className="form-control mt-2" placeholder={item.extra} value={respostas[item.chave + '_extra'] || ''} onChange={e => handleExtraChange(item.chave, e.target.value)} />
                  )}
                </div>
              </div>
            </div>
          ))}

          {mensagem && <label className="text-danger d-block text-end mb-2">{mensagem}</label>}

          <div className="text-end mt-4">
            <button type="button" className="btn btn-outline-primary px-4" onClick={ handleFinalizar}>
             Finalizar
            </button>
          </div>


        </form>
      </div>
    </div>
  );
};

export default FormularioMedico;
