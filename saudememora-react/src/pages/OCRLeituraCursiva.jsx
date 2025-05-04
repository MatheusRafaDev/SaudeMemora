import React, { useState } from "react";
import Tesseract from "tesseract.js";

const OcrCursivoCorrigido = () => {
  const [image, setImage] = useState(null);
  const [textoOriginal, setTextoOriginal] = useState("");
  const [textoCorrigido, setTextoCorrigido] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const preprocessImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const bw = avg < 180 ? 0 : 255;
          data[i] = data[i + 1] = data[i + 2] = bw;
        }

        ctx.putImageData(imageData, 0, 0);
        canvas.toBlob((blob) => resolve(blob), "image/png");
      };
    });
  };

  const corrigirTexto = async (texto) => {
    const response = await fetch("https://api.languagetoolplus.com/v2/check", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        text: texto,
        language: "pt-BR",
      }),
    });

    const data = await response.json();
    let corrigido = texto;
    data.matches.reverse().forEach((match) => {
      if (match.replacements.length > 0) {
        corrigido =
          corrigido.slice(0, match.offset) +
          match.replacements[0].value +
          corrigido.slice(match.offset + match.length);
      }
    });

    return corrigido;
  };

  const handleOcr = async () => {
    if (!image) return;
    setLoading(true);
    setTextoOriginal("Reconhecendo...");
    setTextoCorrigido("");

    const processedImage = await preprocessImage(image);

    Tesseract.recognize(processedImage, "por", {
      logger: (m) => console.log(m),
    })
      .then(async ({ data: { text } }) => {
        setTextoOriginal(text);
        const textoFinal = await corrigirTexto(text);
        setTextoCorrigido(textoFinal);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro no OCR:", err);
        setTextoOriginal("Erro no OCR.");
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>OCR para Letra Cursiva + Correção Ortográfica</h2>

      <input type="file" accept="image/*" onChange={handleImageChange} />
      <br /><br />

      <button onClick={handleOcr} disabled={!image || loading}>
        {loading ? "Processando..." : "Fazer OCR e Corrigir"}
      </button>

      {textoOriginal && (
        <div style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
          <h3>Texto original (OCR):</h3>
          <p>{textoOriginal}</p>
        </div>
      )}

      {textoCorrigido && (
        <div style={{ marginTop: "20px", whiteSpace: "pre-wrap", color: "#007700" }}>
          <h3>Texto corrigido:</h3>
          <p>{textoCorrigido}</p>
        </div>
      )}
    </div>
  );
};

export default OcrCursivoCorrigido;
