import axiosInstance from "../axiosConfig";

const ProntuarioService = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get("/api/prontuarios");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao buscar prontuários:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao buscar prontuários!",
      };
    }
  },

  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/prontuarios/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Erro ao buscar prontuário ${id}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao buscar prontuário!",
      };
    }
  },

  create: async (prontuario) => {
    try {
      const response = await axiosInstance.post("/api/prontuarios", prontuario);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao criar prontuário:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao criar prontuário!",
      };
    }
  },

  update: async (id, prontuario) => {
    try {
      const response = await axiosInstance.put(`/api/prontuarios/${id}`, prontuario);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Erro ao atualizar prontuário ${id}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao atualizar prontuário!",
      };
    }
  },

  delete: async (id) => {
    try {
      await axiosInstance.delete(`/api/prontuarios/${id}`);
      return { success: true, message: "Prontuário deletado com sucesso!" };
    } catch (error) {
      console.error(`Erro ao deletar prontuário ${id}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao deletar prontuário!",
      };
    }
  },
};

export default ProntuarioService;
