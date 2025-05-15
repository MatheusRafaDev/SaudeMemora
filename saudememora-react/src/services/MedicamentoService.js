import axiosInstance from "../axiosConfig";

const MedicamentoService = {
  // 1) Obter todos os medicamentos
  getAll: async () => {
    try {
      const response = await axiosInstance.get("/api/medicamentos");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao buscar medicamentos:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao buscar medicamentos!",
      };
    }
  },

  // 2) Obter um medicamento pelo ID
  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/medicamentos/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Erro ao buscar medicamento ${id}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao buscar medicamento!",
      };
    }
  },

  // 3) Obter medicamentos por ID da receita
  getMedicamentosByReceitaId: async (receitaId) => {
    try {
      const response = await axiosInstance.get(`/api/medicamentos/receita/${receitaId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Erro ao buscar medicamentos pela receita ID ${receitaId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao buscar medicamentos pela receita!",
      };
    }
  },

  // 4) Criar um novo medicamento
  create: async (medicamento) => {
    try {
      const response = await axiosInstance.post("/api/medicamentos", medicamento);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao criar medicamento:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao criar medicamento!",
      };
    }
  },

  // 5) Atualizar um medicamento existente
  update: async (id, medicamento) => {
    try {
      const response = await axiosInstance.put(`/api/medicamentos/${id}`, medicamento);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Erro ao atualizar medicamento ${id}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao atualizar medicamento!",
      };
    }
  },

  // 6) Deletar um medicamento pelo ID
  delete: async (id) => {
    try {
      await axiosInstance.delete(`/api/medicamentos/${id}`);
      return { success: true, message: "Medicamento deletado com sucesso!" };
    } catch (error) {
      console.error(`Erro ao deletar medicamento ${id}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao deletar medicamento!",
      };
    }
  },
};

export default MedicamentoService;