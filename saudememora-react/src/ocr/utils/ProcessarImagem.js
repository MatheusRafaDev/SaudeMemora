export default function ProcessarImagem(file) {
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
