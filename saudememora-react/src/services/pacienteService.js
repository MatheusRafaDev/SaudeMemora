
import axiosInstance from "../axiosConfig"; 


export const loginPaciente = async (email, senha) => {
  try {
    const response = await axiosInstance.post("/api/paciente/login", {
      email,
      senha,
    });

    if (response.status === 200) {
      return { success: true, data: response.data };
    }
  } catch (error) {
    if (error.response && error.response.data) {

      const mensagem =
        typeof error.response.data === "string"
          ? error.response.data
          : error.response.data.message || "Credenciais inválidas";
      return { success: false, message: mensagem };
    } else {
      return { success: false, message: "Erro ao conectar com o servidor." };
    }
  }
};




export const cadastrarPaciente = async (formData) => {
  try {
    const response = await axiosInstance.post("/api/paciente/cadastrar", formData);

    if (response.status === 200 || response.status === 201) {
      return { success: true, message: "Paciente cadastrado com sucesso!",dados: response.data.dados };
    } else {
      return { success: false, message: "Erro ao cadastrar paciente. Verifique os dados." };
    }

  } catch (error) {
    console.error("Erro ao cadastrar paciente:", error);
    if (error.response && error.response.data) {
      const mensagem =
        typeof error.response.data === "string"
          ? error.response.data
          : error.response.data.message || "Erro inesperado no cadastro.";
      return { success: false, message: mensagem };
    }
    return { success: false, message: "Erro desconhecido ao cadastrar paciente!" };
  }
};


export const atualizarPaciente = async (id, formData) => {
  try {
    const response = await axiosInstance.put(
      `/api/paciente/${id}`,
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
    const response = await axiosInstance.delete(`/api/paciente/${id}`);
    if (response.status === 200) {
      return { success: true, message: "Paciente deletado com sucesso!" };
    }
  } catch (error) {
    console.error("Erro ao deletar paciente:", error); // Log do erro para debug
    return { success: false, message: "Erro ao deletar paciente!" };
  }
};

export const obterPaciente = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/paciente/${id}`);
    if (response.status === 200) {
      return { success: true, data: response.data };
    }
  } catch (error) {
    console.error("Erro ao obter paciente:", error);
    return { success: false, message: "Erro ao obter paciente." };
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
