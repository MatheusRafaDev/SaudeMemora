import axios from 'axios';
import { corrigirTexto } from './utils/corretor';

const API_KEY = 'K87295381088957';
const URL = 'https://api.ocr.space/parse/image';


/**
 * Faz OCR após pré-processar a imagem (grayscale + resize + binarização).
 * @param {File} file - Imagem original (File ou Blob).
 * @returns {Promise<string>} Texto extraído.
 */
export async function ocrSpace(file) {


  try {
    const processedBlob = await preprocessImage(file);
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
    parsedText = processarTexto(parsedText);
    console.log(parsedText)
    parsedText = corrigirTexto(parsedText);
  
    return parsedText;

  } catch (err) {
    handleError(err);
    return '';
  }
}

function processarTexto(texto) {
  const linhas = texto.split("\n");
  const resultados = [];
  let linhaPressao = "";

  linhas.forEach(linha => {
    const [pergunta, resposta] = linha.split("?");

    if (!resposta) {
      // Trata linha de pressão arterial
      if (linha.includes("Pressão arterial")) {
        linhaPressao = "Pressão arterial: NORMAL: (X)  ALTA: ( )  BAIXA: ( )";
      }
      // Ignora outras linhas sem "?"
      return;
    }

    // Ignora se a linha não tiver nenhum parêntese ()
    if (!linha.includes("(")) return;

    let sim = " ";
    let nao = " ";

    if (/SIM.*[^()\s]+.*NÃO/.test(resposta)) {
      sim = "X";
    } else if (/SIMPS/.test(resposta)) {
      sim = "X";
    } else if (/\bSIM\s*\(\s*\)/.test(resposta)) {
      nao = "X";
    } else if (/NÃO.*[A-Za-z?*)]/.test(resposta)) {
      nao = "X";
    } else if (/SIM.*[XOB*]/.test(resposta)) {
      sim = "X";
    }

    resultados.push(`${pergunta.trim()}? SIM: (${sim})  NÃO: (${nao})`);
  });

  return [...resultados, linhaPressao].filter(Boolean).join("\n");
}


function getParsedText(data) {
  const results = data?.ParsedResults;
  if (!results) return '';
  return results.map(r => r?.ParsedText).join('\n').trim();
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

export async function preprocessImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const TARGET_WIDTH = 1200;
      const scale = TARGET_WIDTH / img.width;
      const canvas = document.createElement('canvas');
      canvas.width = TARGET_WIDTH;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const contrast = 1.4;
      const intercept = 128 * (1 - contrast);
      const threshold = 160;

      for (let i = 0; i < data.length; i += 4) {
        const avg = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
        const val = contrast * avg + intercept;
        const final = val > threshold ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = final;
      }

      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob(blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Erro ao converter imagem tratada.'));
        }
      }, 'image/png');
    };

    img.onerror = reject;

    const reader = new FileReader();
    reader.onload = e => {
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
