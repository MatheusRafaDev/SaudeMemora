import axiosInstance from "../axiosConfig";

const ReceitaService = {
  // Buscar todas as receitas
  getAll: async () => {
    try {
      const response = await axiosInstance.get("/api/receitas");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao buscar todas as receitas:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao buscar receitas!",
      };
    }
  },

  // Buscar receita por ID
  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/receitas/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Erro ao buscar receita por ID ${id}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao buscar receita!",
      };
    }
  },

  // Buscar receita por ID do documento
  getReceitaByDocumentoId: async (documentoId) => {
    try {
      const response = await axiosInstance.get(`/api/receitas/documento/${documentoId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Erro ao buscar receita pelo ID do documento ${documentoId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao buscar receita pelo ID do documento!",
      };
    }
  },

  // Criar uma nova receita
  create: async (receita) => {
    try {
      

      const response = await axiosInstance.post("/api/receitas", receita, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao criar receita:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao criar receita!",
      };
    }
  },

  // Atualizar receita existente
  update: async (id, receita) => {
    try {
      const response = await axiosInstance.put(`/api/receitas/${id}`, receita);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Erro ao atualizar receita com ID ${id}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao atualizar receita!",
      };
    }
  },

  // Deletar receita por ID
  delete: async (id) => {
    try {
      await axiosInstance.delete(`/api/receitas/${id}`);
      return { success: true, message: "Receita deletada com sucesso!" };
    } catch (error) {
      console.error(`Erro ao deletar receita com ID ${id}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao deletar receita!",
      };
    }
  },

  // Criar receita com imagem
  createWithImage: async (formData) => {
    try {
      const response = await axiosInstance.post("/api/receitas", formData);
      
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Erro ao criar a receita."
      );
    }
  },
};

export default ReceitaService;