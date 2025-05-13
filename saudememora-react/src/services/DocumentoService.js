import axios from "axios";

const API_BASE_URL = "http://localhost:8080/documentos"; // ajuste se o backend estiver em outra porta

const DocumentoService = {
  // Buscar todos os documentos (caso tenha esse endpoint no futuro)
  getAll: async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  },

  // Buscar por ID do documento
  getById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  // Buscar por tipo de documento (ex: "R", "E", "P")
  getByTipo: async (tipo) => {
    const response = await axios.get(`${API_BASE_URL}/tipo/${tipo}`);
    return response.data;
  },

  // Buscar por paciente, agrupando por tipo de documento
  getPorPacienteAgrupado: async (idPaciente) => {
    const response = await axios.get(`${API_BASE_URL}/paciente/${idPaciente}`);
    return response.data;
  }
};

export default DocumentoService;
