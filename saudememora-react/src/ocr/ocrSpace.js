import axios from 'axios';
import { corrigirTexto } from './utils/corretor';

import  ProcessarImagem  from './utils/ProcessarImagem';
import  getParsedText  from './utils/ProcessarTexto';

const API_KEY = process.env.REACT_APP_OCR_SPACE_API_KEY;
//const API_KEY = 'K87295381088957'; // valor literal da chave

const URL = 'https://api.ocr.space/parse/image';


/**
 * Faz OCR após pré-processar a imagem (grayscale + resize + binarização).
 * @param {File} file - Imagem original (File ou Blob).
 * @returns {Promise<string>} Texto extraído.
 */
export async function ocrSpace(file) {


  try {
    const processedBlob = await ProcessarImagem(file);
    const formData = new FormData();

    formData.append('apikey', API_KEY);
    formData.append('file', processedBlob, 'imagem.png'); // corrigido com nome e extensão
    formData.append('language', 'por');
    formData.append('isOverlayRequired', 'true');
    formData.append('detectOrientation', 'true');
    formData.append('scale', 'true');
    formData.append('OCREngine', '2');
    formData.append('isTable', 'true');

    const res = await axios.post(URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    if (res.data.IsErroredOnProcessing) {
      throw new Error(res.data.ErrorMessage || 'Erro ao processar imagem no OCR.space');
    }

  
    let parsedText = getParsedText(res.data); 

    return parsedText;

  } catch (err) {
    handleError(err);
    return '';
  }
}


function handleError(err) {
  if (axios.isAxiosError(err)) {
    console.error('Erro de rede:', err.message);
    if (err.response) {
      console.error('Resposta do servidor:', err.response.data);
    }
  } else {
    console.error('Erro inesperado:', err.message || err);
  }
}




