import axios from 'axios';
import { createWorker } from 'tesseract.js';
import { corrigirTexto } from './utils/corretor';
import ProcessarImagem from './utils/ProcessarImagem';
import getParsedText from './utils/ProcessarTexto';

const API_KEY = process.env.REACT_APP_OCR_SPACE_API_KEY;
const OCR_SPACE_URL = 'https://api.ocr.space/parse/image';

/**
 * Realiza OCR usando o serviço OCR.space
 * @param {File} file - Imagem para processamento
 * @returns {Promise<string>} Texto extraído e processado
 */
export async function ocrSpace2(file) {
  try {
    const processedBlob = await ProcessarImagem(file);
    const formData = new FormData();

    formData.append('apikey', API_KEY);
    formData.append('file', processedBlob, 'imagem.png');
    formData.append('language', 'por');
    formData.append('isOverlayRequired', 'true');
    formData.append('detectOrientation', 'true');
    formData.append('scale', 'true');
    formData.append('OCREngine', '2');
    formData.append('isTable', 'true');

    const res = await axios.post(OCR_SPACE_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    console.log('Resposta do OCR.space:', res);

    if (res.data.IsErroredOnProcessing) {
      throw new Error(res.data.ErrorMessage || 'Erro ao processar imagem no OCR.space');
    }

    return getParsedText(res.data);

  } catch (err) {
    handleError(err);
    return '';
  }
}

/**
 * Realiza OCR usando Tesseract.js (local)
 * @param {File} file - Imagem para processamento
 * @param {Object} [options] - Opções de configuração
 * @param {boolean} [options.logProgress=false] - Se deve logar o progresso
 * @returns {Promise<string>} Texto extraído e processado
 */


export async function ocrSpace(file, options = {}) {
  const { logProgress = false } = options;
  const worker = await createWorker();

  try {
    const processedBlob = await ProcessarImagem(file); // Suponha que você já tenha binarização, contraste, etc.

    if (logProgress) {
      worker.on('progress', status => {
        console.log(`Progresso OCR: ${status.status} (${Math.round(status.progress * 100)}%)`);
      });
    }

    await worker.setParameters({
      tessedit_pageseg_mode: '3', // 3 = Fully automatic page segmentation, good balance
      preserve_interword_spaces: '1',
      user_defined_dpi: '300',
      tessjs_create_hocr: '1',
      tessjs_create_tsv: '1',
      tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZáéíóúâêîôûãõàèìòùçÁÉÍÓÚÂÊÎÔÛÃÕÀÈÌÒÙÇ.,;:!?()[]{}-_/\\\'"@#$%&*+=<>'
    });

    const { data: { text } } = await worker.recognize(processedBlob);

    return processTesseractText(text);

  } catch (err) {
    console.error('Erro durante o OCR:', err);
    throw new Error('Falha no processamento OCR');
  } finally {
    await worker.terminate().catch(e => console.warn('Erro ao encerrar worker:', e));
  }
}


/**
 * Processa o texto extraído pelo Tesseract
 * @param {string} text - Texto bruto do OCR
 * @returns {string} Texto processado
 */
function processTesseractText(text) {
  return text
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => corrigirTexto(line.trim()))
    .join('\n');
}

/**
 * Tratamento centralizado de erros
 * @param {Error} err - Erro capturado
 */
function handleError(err) {
  if (axios.isAxiosError(err)) {
    console.error('Erro de rede:', err.message);
    if (err.response) {
      console.error('Detalhes:', err.response.data);
    }
  } else {
    console.error('Erro no OCR:', err.message || err);
  }
}

/**
 * Função inteligente que escolhe o melhor método de OCR disponível
 * @param {File} file - Imagem para processamento
 * @param {Object} [options] - Opções
 * @param {boolean} [options.fallback=true] - Usa Tesseract se OCR.space falhar
 * @returns {Promise<string>} Texto extraído
 */
