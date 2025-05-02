import axiosInstance from "../axiosConfig"; 

export const cadastrarPaciente = async (formData) => {
  try {
    const response = await axiosInstance.post(
      "/api/paciente/cadastrar", 
      formData
    );
    if (response.status === 200) {
      return { success: true, message: "Paciente cadastrado com sucesso!" };
    }
  } catch (error) {
    console.error("Erro ao cadastrar paciente:", error); // Log do erro para debug
    if (error.response && error.response.data) {
      return { success: false, message: error.response.data };
    }
    return { success: false, message: "Erro desconhecido ao cadastrar paciente!" };
  }
};

export const atualizarPaciente = async (id, formData) => {
  try {
    const response = await axiosInstance.put(
      `/api/paciente/atualizar/${id}`,
      formData
    );
    if (response.status === 200) {
      return { success: true, message: "Paciente atualizado com sucesso!" };
    }
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error); // Log do erro para debug
    return { success: false, message: "Erro ao atualizar paciente!" };
  }
};

export const deletarPaciente = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/paciente/deletar/${id}`);
    if (response.status === 200) {
      return { success: true, message: "Paciente deletado com sucesso!" };
    }
  } catch (error) {
    console.error("Erro ao deletar paciente:", error); // Log do erro para debug
    return { success: false, message: "Erro ao deletar paciente!" };
  }
};

// Função para buscar todos os pacientes
export const listarPacientes = async () => {
  try {
    const response = await axiosInstance.get("/api/paciente/listar");
    if (response.status === 200) {
      return { success: true, data: response.data };
    }
  } catch (error) {
    console.error("Erro ao listar pacientes:", error); // Log do erro para debug
    return { success: false, message: "Erro ao listar pacientes!" };
  }
};
