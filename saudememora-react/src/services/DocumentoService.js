// src/services/DocumentoService.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL  // ex.: http://localhost:8080
});

const DocumentoService = {
  getAll: () => API.get('/documentos').then(res => res.data),
  delete: id => API.delete(`/documentos/${id}`)
};

export default DocumentoService;
