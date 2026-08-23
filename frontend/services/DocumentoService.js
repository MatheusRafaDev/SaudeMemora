import axiosInstance from "../axiosConfig";

const DocumentoService = {
  // Buscar todos os documentos
  getAll: async () => {
    try {
      const response = await axiosInstance.get("/api/documentos");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao buscar todos os documentos:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao buscar documentos!",
      };
    }
  },

  // Buscar por ID do documento
  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/documentos/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao buscar documento por ID:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao buscar documento!",
      };
    }
  },

  // Buscar por paciente, agrupando por tipo de documento
  getPorPacienteAgrupado: async (idPaciente) => {
    try {
      const response = await axiosInstance.get(
        `/api/documentos/paciente/${idPaciente}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao buscar documentos por paciente:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Erro ao buscar documentos por paciente!",
      };
    }
  },

  // Buscar documentos por paciente e tipo de documento
  getPorPacienteETipo: async (idPaciente, tipoDocumento) => {
    try {
      const response = await axiosInstance.get(
        `/api/documentos/paciente/${idPaciente}/tipo/${tipoDocumento}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error(
        `Erro ao buscar documentos para o paciente ${idPaciente} e tipo ${tipoDocumento}:`,
        error
      );
      return {
        success: false,
        message: "Erro ao buscar documentos por paciente e tipo.",
      };
    }
  },

  // Criar um novo documento
  create: async (documento) => {
    try {
      const response = await axiosInstance.post(
        "/api/documentos",
        JSON.stringify(documento),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao criar documento:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao criar documento!",
      };
    }
  },

  // Deletar um documento por ID e tipo
  deleteDocumento: async (id, tipo) => {
    try {
      const response = await axiosInstance.delete(`/api/documentos/${id}`, {
        params: { tipo },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao deletar documento:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          `Erro ao deletar documento do tipo ${tipo}!`,
      };
    }
  },

  // Listar documentos com filtro
  listarDocumentos: async () => {
    try {
      const response = await axiosInstance.get("/api/documentos");

      if (response.status === 200) {
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error("Erro ao listar documentos:", error);
      return {
        success: false,
        message: "Erro ao listar documentos!",
      };
    }
  },
};

export default DocumentoService;
