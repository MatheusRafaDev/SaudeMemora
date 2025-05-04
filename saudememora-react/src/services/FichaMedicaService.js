import axiosInstance from "../axiosConfig"; // Supondo que axiosInstance esteja configurado corretamente

// Função para cadastrar uma nova ficha médica
export const cadastrarFichaMedica = async (formData) => {
  try {
    const file = formData.imagem;  // A imagem é extraída de formData

    // Função para ler a imagem em base64
    const reader = new FileReader();

    // Promessa que irá retornar o base64 da imagem
    const getImageBase64 = () => {
      return new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result); // Retorna o resultado após ler
        reader.onerror = reject; // Caso haja erro na leitura
        reader.readAsDataURL(file); // Lê a imagem como base64
      });
    };

    // Processando a imagem, se existir
    const imagemBase64 = file ? await getImageBase64() : "";

    // Remover o prefixo "image/jpeg;base64," do base64, caso esteja presente
    const imagemBase64SemPrefixo = imagemBase64.split(',')[1] || "";

    const paciente = formData.result.dados;
    const respostas = formData.respostas;
    
    const FichaMedica = {
      paciente: {
        id: paciente.id,
        nome: paciente.nome,
        cpf: paciente.cpf,
        email: paciente.email,
        telefone: paciente.telefone
      },
      imagem: imagemBase64SemPrefixo,  // Agora com a imagem sem o prefixo
      ocrTexto: formData.textoOCR || "",  // Se o texto OCR não for fornecido, será uma string vazia

      pressao: respostas.pressao,
      tratamentoMedico: respostas.tratamentoMedico === 'SIM',
      gravidez: respostas.gravidez === 'SIM',
      regime: respostas.regime === 'SIM',
      diabetes: respostas.diabetes === 'SIM',
      alergias: respostas.alergias === 'SIM',
      febreReumatica: respostas.febreReumatica === 'SIM',
      coagulacao: respostas.coagulacao === 'SIM',
      doencaCardioVascular: respostas.doencaCardioVascular === 'SIM',
      hemorragicos: respostas.hemorragicos === 'SIM',
      problemasAnestesia: respostas.problemasAnestesia === 'SIM',
      alergiaMedicamentos: respostas.alergiaMedicamentos === 'SIM',
      hepatite: respostas.hepatite === 'SIM',
      hiv: respostas.hiv === 'SIM',
      drogas: respostas.drogas === 'SIM',
      fumante: respostas.fumante === 'SIM',
      fumou: respostas.fumou === 'SIM',
      respiratorios: respostas.respiratorios === 'SIM'
    };


    const response = await axiosInstance.post(
      '/api/ficha-medica/cadastrar',
      FichaMedica,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.status === 200 || response.status === 201) {
      return { success: true, message: "Ficha médica cadastrada com sucesso!" };
    } else {
      return { success: false, message: "Erro ao cadastrar ficha médica. Verifique os dados." };
    }
  } catch (error) {
    console.error("Erro ao cadastrar ficha médica:", error);
    if (error.response && error.response.data) {
      const mensagem =
        typeof error.response.data === "string"
          ? error.response.data
          : error.response.data.message || "Erro inesperado no cadastro.";
      return { success: false, message: mensagem };
    }
    return { success: false, message: "Erro desconhecido ao cadastrar ficha médica!" };
  }
};




// Função para atualizar os dados de uma ficha médica
export const atualizarFichaMedica = async (id, formData) => {
  try {
    const response = await axiosInstance.put(
      `/api/ficha-medica/${id}`,  // Rota para atualizar a ficha médica com o ID fornecido
      formData
    );
    if (response.status === 200) {
      return { success: true, message: "Ficha médica atualizada com sucesso!" };
    }
  } catch (error) {
    console.error("Erro ao atualizar ficha médica:", error); // Log do erro para debug
    return { success: false, message: "Erro ao atualizar ficha médica!" };
  }
};

// Função para deletar uma ficha médica
export const deletarFichaMedica = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/ficha-medica/${id}`);  // Rota para deletar a ficha médica com o ID fornecido
    if (response.status === 200) {
      return { success: true, message: "Ficha médica deletada com sucesso!" };
    }
  } catch (error) {
    console.error("Erro ao deletar ficha médica:", error); // Log do erro para debug
    return { success: false, message: "Erro ao deletar ficha médica!" };
  }
};

// Função para listar todas as fichas médicas
export const listarFichasMedicas = async () => {
  try {
    const response = await axiosInstance.get("/api/ficha-medica");  // Rota para listar todas as fichas médicas
    if (response.status === 200) {
      return { success: true, data: response.data };
    }
  } catch (error) {
    console.error("Erro ao listar fichas médicas:", error); // Log do erro para debug
    return { success: false, message: "Erro ao listar fichas médicas!" };
  }
};

// Função para buscar uma ficha médica específica pelo ID
export const buscarFichaMedica = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/ficha-medica/${id}`);  // Rota para buscar uma ficha médica específica
    if (response.status === 200) {
      return { success: true, data: response.data };
    }
  } catch (error) {
    console.error("Erro ao buscar ficha médica:", error); // Log do erro para debug
    return { success: false, message: "Erro ao buscar ficha médica!" };
  }
};
