import axiosInstance from "../axiosConfig";

export const cadastrarFichaMedica = async (formData) => {
  try {;
    const paciente = JSON.parse(localStorage.getItem("paciente")) || {};
    const respostas = formData.has("respostas") ? JSON.parse(formData.get("respostas")) : {};
    const ocrTexto = formData.has("textoOCR") ? formData.get("textoOCR") : "";


    const fichaMedicaData = {
      paciente: {
        id: paciente.id,
        nome: paciente.nome,
        cpf: paciente.cpf,
        email: paciente.email,
        telefone: paciente.telefone
      },
      imagem: "",
      ocrTexto,
      pressao: respostas.pressao || "",
      tratamentoMedico: respostas.tratamento_medico === 'SIM',
      tratamentoMedicoExtra: respostas.tratamento_medico_extra || "",
      gravidez: respostas.gravida === 'SIM',
      gravidezExtra: respostas.gravida_extra || "",
      regime: respostas.regime === 'SIM',
      regimeExtra: respostas.regime_extra || "",
      diabetes: respostas.diabetes === 'SIM',
      diabetesExtra: respostas.diabetes_extra || "",
      alergias: respostas.alergias === 'SIM',
      alergiasExtra: respostas.alergias_extra || "",
      reumatica: respostas.reumatica === 'SIM',
      coagulacao: respostas.coagulacao === 'SIM',
      doencaCardioVascular: respostas.cardio === 'SIM',
      doencaCardioVascularExtra: respostas.cardio_extra || "",
      hemorragicos: respostas.hemorragicos === 'SIM',
      problemasAnestesia: respostas.anestesia === 'SIM',
      problemasAnestesiaExtra: respostas.anestesia_extra || "",
      alergiaMedicamentos: respostas.alergia_medicamento === 'SIM',
      alergiaMedicamentosExtra: respostas.alergia_medicamento_extra || "",
      hepatite: respostas.hepatite === 'SIM',
      hepatiteExtra: respostas.hepatite_extra || "",
      hiv: respostas.hiv === 'SIM',
      drogas: respostas.drogas === 'SIM',
      fumante: respostas.fumante === 'SIM',
      fumou: respostas.fumou === 'SIM',
      respiratorio: respostas.respiratorio === 'SIM',
      respiratorioExtra: respostas.respiratorio_extra || "",
      doencaFamilia: respostas.doenca_familia === 'SIM',
      doencaFamiliaExtra: respostas.doenca_familia_extra || ""
    };

    const response = await axiosInstance.post(
      '/api/ficha-medica/cadastrar',
      fichaMedicaData,
      { headers: { 'Content-Type': 'application/json' } }
    );

    return {
      success: response.status === 200 || response.status === 201,
      message: response.status === 200 || response.status === 201 
        ? "Ficha médica cadastrada com sucesso!" 
        : "Erro ao cadastrar ficha médica. Verifique os dados.",
      data: response.data
    };

  } catch (error) {
    console.error("Erro ao cadastrar ficha médica:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Erro ao cadastrar ficha médica!"
    };
  }
};

export const atualizarFichaMedica = async (id, formData) => {
  try {

    const paciente = JSON.parse(localStorage.getItem("paciente")) || {};
    const respostas = formData.has("respostas") ? JSON.parse(formData.get("respostas")) : {};
    const ocrTexto = formData.has("textoOCR") ? formData.get("textoOCR") : "";



    const fichaMedicaData = {
      paciente: {
        id: paciente.id,
        nome: paciente.nome,
        cpf: paciente.cpf,
        email: paciente.email,
        telefone: paciente.telefone
      },
      imagem: "",
      ocrTexto,
      pressao: respostas.pressao || "",
      tratamentoMedico: respostas.tratamento_medico === 'SIM',
      tratamentoMedicoExtra: respostas.tratamento_medico_extra || "",
      gravidez: respostas.gravida === 'SIM',
      gravidezExtra: respostas.gravida_extra || "",
      regime: respostas.regime === 'SIM',
      regimeExtra: respostas.regime_extra || "",
      diabetes: respostas.diabetes === 'SIM',
      diabetesExtra: respostas.diabetes_extra || "",
      alergias: respostas.alergias === 'SIM',
      alergiasExtra: respostas.alergias_extra || "",
      reumatica: respostas.reumatica === 'SIM',
      coagulacao: respostas.coagulacao === 'SIM',
      doencaCardioVascular: respostas.cardio === 'SIM',
      doencaCardioVascularExtra: respostas.cardio_extra || "",
      hemorragicos: respostas.hemorragicos === 'SIM',
      problemasAnestesia: respostas.anestesia === 'SIM',
      problemasAnestesiaExtra: respostas.anestesia_extra || "",
      alergiaMedicamentos: respostas.alergia_medicamento === 'SIM',
      alergiaMedicamentosExtra: respostas.alergia_medicamento_extra || "",
      hepatite: respostas.hepatite === 'SIM',
      hepatiteExtra: respostas.hepatite_extra || "",
      hiv: respostas.hiv === 'SIM',
      drogas: respostas.drogas === 'SIM',
      fumante: respostas.fumante === 'SIM',
      fumou: respostas.fumou === 'SIM',
      respiratorio: respostas.respiratorio === 'SIM',
      respiratorioExtra: respostas.respiratorio_extra || "",
      doencaFamilia: respostas.doenca_familia === 'SIM',
      doencaFamiliaExtra: respostas.doenca_familia_extra || ""
    };

    const response = await axiosInstance.put(
      `/api/ficha-medica/atualizar/${id}`,
      fichaMedicaData,
      { headers: { 'Content-Type': 'application/json' } }
    );

    return {
      success: response.status === 200,
      message: response.status === 200
        ? "Ficha médica atualizada com sucesso!"
        : "Erro ao atualizar ficha médica. Verifique os dados.",
      data: response.data
    };

  } catch (error) {
    console.error("Erro ao atualizar ficha médica:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Erro ao atualizar ficha médica!"
    };
  }
};

export const deletarFichaMedica = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/ficha-medica/${id}`);
    return {
      success: response.status === 200,
      message: response.status === 200
        ? "Ficha médica deletada com sucesso!"
        : "Erro ao deletar ficha médica"
    };
  } catch (error) {
    console.error("Erro ao deletar ficha médica:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Erro ao deletar ficha médica!"
    };
  }
};

export const buscarFichaMedica = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/ficha-medica/paciente/${id}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("Erro ao buscar ficha médica:", error);
    return {
      success: false,
      message: getErrorMessage(error, "Erro ao buscar ficha médica")
    };
  }
};

export const buscarImagemFichaMedica = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/api/ficha-medica/paciente/${id}/imagem`,
      { responseType: 'arraybuffer' }
    );

    if (response.status === 200) {
      const arrayBufferView = new Uint8Array(response.data);
      const imageBase64 = btoa(String.fromCharCode(...arrayBufferView));
      return {
        success: true,
        image: `data:image/jpeg;base64,${imageBase64}`
      };
    }
    return {
      success: false,
      message: "Erro ao buscar imagem da ficha médica."
    };
  } catch (error) {
    console.error("Erro ao buscar imagem da ficha médica:", error);
    return {
      success: false,
      message: getErrorMessage(error, "Erro ao buscar imagem da ficha médica")
    };
  }
};

// Helper functions
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      resolve(result?.includes(',') ? result.split(',')[1] : "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const getErrorMessage = (error, defaultMessage) => {
  if (error.response) {
    return error.response.data?.message || error.response.statusText || defaultMessage;
  } else if (error.request) {
    return "Erro de rede: Nenhuma resposta do servidor.";
  }
  return error.message || defaultMessage;
};