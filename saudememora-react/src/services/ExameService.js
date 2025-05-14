import axiosInstance from "../axiosConfig";

const ExameService = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get("/api/exames");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao buscar exames:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao buscar exames!",
      };
    }
  },

  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/exames/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Erro ao buscar exame ${id}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao buscar exame!",
      };
    }
  },

  create: async (exame) => {
    try {
      const response = await axiosInstance.post("/api/exames", exame);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao criar exame:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao criar exame!",
      };
    }
  },

  update: async (id, exame) => {
    try {
      const response = await axiosInstance.put(`/api/exames/${id}`, exame);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Erro ao atualizar exame ${id}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao atualizar exame!",
      };
    }
  },

  delete: async (id) => {
    try {
      await axiosInstance.delete(`/api/exames/${id}`);
      return { success: true, message: "Exame deletado com sucesso!" };
    } catch (error) {
      console.error(`Erro ao deletar exame ${id}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao deletar exame!",
      };
    }
  },
};

export default ExameService;
