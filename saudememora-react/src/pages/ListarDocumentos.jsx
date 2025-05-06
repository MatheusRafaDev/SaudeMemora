
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DocumentoService from '../services/DocumentoService';

export default function ListarDocumentos() {
  const [documentos, setDocumentos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await DocumentoService.getAll();
        setDocumentos(data);
      } catch {
        setError('Erro ao carregar documentos.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('Confirma exclusão deste documento?')) return;
    try {
      await DocumentoService.delete(id);
      setDocumentos(docs => docs.filter(d => d.id !== id));
    } catch {
      alert('Falha ao excluir documento.');
    }
  };

  const listaFiltrada = documentos.filter(d =>
    d.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Documentos</h1>

      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Filtrar por nome..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="border px-2 py-1 flex-grow"
        />
        <Link
          to="/listar-documentos/novo"
          className="ml-4 bg-blue-500 text-white px-3 py-1 rounded"
        >
          + Novo
        </Link>
      </div>

      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Nome</th>
              <th className="py-2 px-4 border-b">Data</th>
              <th className="py-2 px-4 border-b">Ações</th>
            </tr>
          </thead>
          <tbody>
            {listaFiltrada.map(doc => (
              <tr key={doc.id}>
                <td className="py-2 px-4 border-b">{doc.id}</td>
                <td className="py-2 px-4 border-b">{doc.nome}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(doc.data).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  <Link
                    to={`/listar-documentos/${doc.id}`}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    Ver
                  </Link>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-600 hover:underline"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {listaFiltrada.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Nenhum documento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
