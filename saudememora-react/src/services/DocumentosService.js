import axiosInstance from "../axiosConfig"; 

export const listarDocumentos = async (tipo,status,dataInicio,dataFim) => {
    try {
        const response = await axiosInstance.get("/api/documentos/listarFiltro", {
            documento: {
            tipo,
            status,
            dataInicio,
            dataFim,
            },
        }); 
      if (response.status === 200) {
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error("Erro ao listar pacientes:", error); // Log do erro para debug
      return { success: false, message: "Erro ao listar pacientes!" };
    }
  };
  