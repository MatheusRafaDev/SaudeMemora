import React, { useState } from 'react';
import { Camera, Upload, FileText } from 'lucide-react';

export default function OCRMobile() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleOcr = async () => {
    if (!image) return;
    setLoading(true);
    setProgress(0);

    // Simulação de progresso
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white px-4 py-3 shadow flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">SaúdeMemora</h1>
        <Camera className="text-blue-600 w-6 h-6" />
      </header>

      <main className="flex-grow p-4 max-w-md w-full mx-auto space-y-5">
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          Processamento de documentos
        </h2>

        {imagePreview && (
          <div className="rounded-xl overflow-hidden bg-white shadow p-2">
            <img src={imagePreview} alt="Preview" className="w-full object-contain" />
          </div>
        )}

        <select
          value={tipoDocumento}
          onChange={(e) => setTipoDocumento(e.target.value)}
          className="w-full p-3 rounded-md shadow text-gray-700 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Tipo de documento</option>
          <option value="prescription">Prescrição médica</option>
          <option value="exam">Exame laboratorial</option>
          <option value="report">Relatório médico</option>
        </select>

        <button
          onClick={() => document.getElementById('camera-input')?.click()}
          className="w-full bg-gray-300 hover:bg-gray-400 text-black p-3 rounded-md flex items-center justify-center space-x-2 shadow"
        >
          <Camera className="w-5 h-5" />
          <span>Tirar foto</span>
        </button>

        <button
          onClick={() => document.getElementById('file-input')?.click()}
          className="w-full bg-gray-300 hover:bg-gray-400 text-black p-3 rounded-md flex items-center justify-center space-x-2 shadow"
        >
          <Upload className="w-5 h-5" />
          <span>Escolher arquivo</span>
        </button>

        <input
          id="camera-input"
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleImageChange}
        />
        <input
          id="file-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        <button
          onClick={handleOcr}
          disabled={!image || loading}
          className={`w-full p-3 rounded-md font-medium flex items-center justify-center space-x-2 shadow transition ${
            !image || loading
              ? 'bg-blue-300 text-white cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Processando... {progress.toFixed(0)}%</span>
            </div>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              <span>Processar documento</span>
            </>
          )}
        </button>
      </main>
    </div>
  );
}
