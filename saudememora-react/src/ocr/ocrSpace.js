import axios from 'axios';
import { createWorker } from 'tesseract.js';
import { corrigirTexto } from './utils/corretor';
import ProcessarImagem from './utils/ProcessarImagem';
import getParsedText from './utils/ProcessarTexto';

const API_KEY = process.env.REACT_APP_OCR_SPACE_API_KEY;
const OCR_SPACE_URL = 'https://api.ocr.space/parse/image';

const OCR_CONFIG = {
  TESSERACT: {
    PSM: '6',  // Page segmentation mode
    OEM: '1',  // OCR Engine mode (LSTM)
    WHITELIST: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZáéíóúâêîôûãõàèìòùçÁÉÍÓÚÂÊÎÔÛÃÕÀÈÌÒÙÇ.,;:!?()-_/\\\'"',
    LANGUAGES: ['por', 'eng']
  },
  OCR_SPACE: {
    ENGINE: 2,
    TIMEOUT: 30000
  }
};

let tesseractWorker;

async function getWorker() {
  if (!tesseractWorker) {
    tesseractWorker = await createWorker();
    await tesseractWorker.load();
    //await tesseractWorker.initialize('por');
  }
  return tesseractWorker;
}

export async function ocrSpace2(file) {
  try {
    const processedBlob = await ProcessarImagem(file, {
      targetDPI: 400,
      sharpnessIntensity: 3
    });

    const formData = new FormData();
    formData.append('apikey', API_KEY);
    formData.append('file', processedBlob, file.name);
    formData.append('language', 'por');
    formData.append('OCREngine', OCR_CONFIG.OCR_SPACE.ENGINE);
    formData.append('isTable', 'true');
    formData.append('detectOrientation', 'true');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OCR_CONFIG.OCR_SPACE.TIMEOUT);

    const res = await axios.post(OCR_SPACE_URL, formData, {
      signal: controller.signal,
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    clearTimeout(timeoutId);

    if (!res.data.ParsedResults?.[0]?.ParsedText) {
      throw new Error('OCR.space retornou resultado vazio');
    }

    return getParsedText(res.data);

  } catch (err) {
    handleError(err, 'ocrSpace');
    throw err; // Permite fallback para Tesseract
  }
}

export async function ocrSpace(file, options = {}) {
  const { logProgress = false } = options;
  const worker = await getWorker();

  try {
    const processedBlob = await ProcessarImagem(file, {
      targetDPI: 300,
      noiseThreshold: 25
    });

    if (logProgress) {
      worker.on('progress', progress => {
        console.log(`[Tesseract] ${progress.status}: ${(progress.progress * 100).toFixed(1)}%`);
      });
    }

    await worker.setParameters({
      tessedit_pageseg_mode: OCR_CONFIG.TESSERACT.PSM,
      tessedit_ocr_engine_mode: OCR_CONFIG.TESSERACT.OEM,
      tessedit_char_whitelist: OCR_CONFIG.TESSERACT.WHITELIST,
      preserve_interword_spaces: '1',
      tessjs_create_hocr: '0'
    });

    const { data: { text } } = await worker.recognize(processedBlob);
    return processTesseractText(text);

  } catch (err) {
    handleError(err, 'ocrSpace2');
    throw err;
  }
}

export async function smartOCR(file, options = {}) {
  const { fallback = true, retryCount = 2 } = options;

  try {
    // Tenta primeiro com OCR.space
    return await ocrSpace(file);
  } catch (err) {
    if (!fallback) throw err;

    console.warn('Falha no OCR.space, tentando Tesseract...');
    
    // Tenta com Tesseract com retry
    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        return await ocrSpace2(file, { logProgress: true });
      } catch (tesseractError) {
        if (attempt === retryCount) throw tesseractError;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
}

function processTesseractText(text) {
  return text
    .split('\n')
    .filter(line => line.trim().length > 3) // Ignora linhas muito curtas
    .map(line => corrigirTexto(line.replace(/\s{2,}/g, ' ').trim()))
    .join('\n');
}

function handleError(err, context = '') {
  const errorInfo = {
    context,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  };

  console.error(`Erro no OCR [${context}]:`, errorInfo);

  if (axios.isAxiosError(err)) {
    errorInfo.responseData = err.response?.data;
    errorInfo.status = err.response?.status;
  }

  // Log adicional para monitoramento
  if (typeof window !== 'undefined' && window.trackJs) {
    window.trackJs.track(errorInfo);
  }
}


