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

      console.log(response);

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
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao buscar documentos para o paciente ${idPaciente} e tipo ${tipoDocumento}:`,
        error
      );
      throw new Error("Erro ao buscar documentos por paciente e tipo.");
    }
  },
};

export default DocumentoService;
