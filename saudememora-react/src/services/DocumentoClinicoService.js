import axiosInstance from "../axiosConfig";

const DocumentoClinicoService = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get("/api/documentosclinicos");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao buscar documentos clínicos:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Erro ao buscar documentos clínicos!",
      };
    }
  },

  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/documentosclinicos/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Erro ao buscar documento clínico ${id}:`, error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Erro ao buscar documento clínico!",
      };
    }
  },

  create: async (documentoClinico) => {

    try {
      const response = await axiosInstance.post("/api/documentosclinicos",documentoClinico);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao criar documento clínico:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Erro ao criar documento clínico!",
      };
    }
  },

  update: async (id, documentoClinico) => {
    try {
      const response = await axiosInstance.put(
        `/api/documentosclinicos/${id}`,
        documentoClinico
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Erro ao atualizar documento clínico ${id}:`, error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Erro ao atualizar documento clínico!",
      };
    }
  },

  delete: async (id) => {
    try {
      await axiosInstance.delete(`/api/documentosclinicos/${id}`);
      return {
        success: true,
        message: "Documento clínico deletado com sucesso!",
      };
    } catch (error) {
      console.error(`Erro ao deletar documento clínico ${id}:`, error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Erro ao deletar documento clínico!",
      };
    }
  },

  getDocumentoClinicoByDocumentoId: async (documentoId) => {
    try {
      const response = await axiosInstance.get(
        `/api/documentosclinicos/documento/${documentoId}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error(
        `Erro ao buscar documento clínico pelo documentoId ${documentoId}:`,
        error
      );
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Erro ao buscar documento clínico por documentoId!",
      };
    }
  },
};

export default DocumentoClinicoService;
