import axiosInstance from "../axiosConfig"; 

export const cadastrarFichaMedica = async (formData) => {
  try {
    const file = formData.get("imagem");


    const getImageBase64 = () => {
      return new Promise((resolve, reject) => {
        if (!file) return resolve("");
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    const imagemBase64 = await getImageBase64();

    const imagemBase64SemPrefixo = imagemBase64?.includes(',')
      ? imagemBase64.split(',')[1]
      : "";

    const paciente = JSON.parse(localStorage.getItem("paciente")) || {};
    const respostas = formData.has("respostas") ? JSON.parse(formData.get("respostas")) : {};
    const ocrTexto = formData.has("textoOCR") ? formData.get("textoOCR") : "";


    const FichaMedica = {
      paciente: {
        id: paciente.id,
        nome: paciente.nome,
        cpf: paciente.cpf,
        email: paciente.email,
        telefone: paciente.telefone
      },
      imagem: imagemBase64SemPrefixo,
      ocrTexto,

      pressao: respostas.pressao || "",
      tratamentoMedico: respostas.tratamentoMedico === 'SIM',
      gravidez: respostas.gravidez === 'SIM',
      regime: respostas.regime === 'SIM',
      diabetes: respostas.diabetes === 'SIM',
      alergias: respostas.alergias === 'SIM',
      reumatica: respostas.febreReumatica === 'SIM',
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
      respiratorio: respostas.respiratorio === 'SIM'
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
    const mensagem =
      error.response?.data?.message || "Erro desconhecido ao cadastrar ficha médica!";
    return { success: false, message: mensagem };
  }
};


export const obterImagemBase64 = async (imagemFile) => {
  try {

    if (!(imagemFile instanceof File)) {
      throw new Error("O argumento não é um arquivo válido.");
    }

    const getImageBase64 = () => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(imagemFile);
      });
    };

    const imagemBase64 = await getImageBase64();

    const imagemBase64SemPrefixo = imagemBase64?.includes(',')
      ? imagemBase64.split(',')[1]
      : "";

    return imagemBase64SemPrefixo;

  } catch (error) {
    console.error("Erro ao obter a imagem em Base64:", error);
    throw new Error("Erro ao converter a imagem em Base64.");
  }
};


export const atualizarFichaMedica = async (id, formData) => {

  try {
    const file = formData?.get("imagem") || null;

    const getImageBase64 = () => {
      return new Promise((resolve, reject) => {
        if (!file) {
          resolve(""); 
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };
    

    const imagemBase64 = await getImageBase64();
    const imagemBase64SemPrefixo = imagemBase64?.split(",")[1] || "";

    const paciente = JSON.parse(localStorage.getItem("paciente")) || {};
    const respostas = formData.has("respostas") ? JSON.parse(formData.get("respostas")) : {};
    const ocrTexto = formData.has("textoOCR") ? formData.get("textoOCR") : "";


    const FichaMedica = {
      paciente: {
        id: paciente.id,
        nome: paciente.nome,
        cpf: paciente.cpf,
        email: paciente.email,
        telefone: paciente.telefone,
      },
      imagem: imagemBase64SemPrefixo,
      ocrTexto,

      pressao: respostas.pressao || "",
      tratamentoMedico: respostas.tratamento_medico=== "SIM",
      gravidez: respostas.gravida === "SIM",
      regime: respostas.regime === "SIM",
      diabetes: respostas.diabetes === "SIM",
      alergias: respostas.alergias === "SIM",
      reumatica: respostas.reumatica === "SIM",
      coagulacao: respostas.coagulacao === "SIM",
      doencaCardioVascular: respostas.cardio === "SIM",
      hemorragicos: respostas.hemorragicos === "SIM",
      problemasAnestesia: respostas.anestesia === "SIM",
      alergiaMedicamentos: respostas.alergia_medicamento === "SIM",
      hepatite: respostas.hepatite === "SIM",
      hiv: respostas.hiv === "SIM",
      drogas: respostas.drogas === "SIM",
      fumante: respostas.fumante === "SIM",
      fumou: respostas.fumou === "SIM",
      respiratorio: respostas.respiratorio === "SIM",
    };


    const response = await axiosInstance.put(
      `/api/ficha-medica/atualizar/${id}`,
      FichaMedica,
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.status === 200) {
      return { success: true, message: "Ficha médica atualizada com sucesso!" };
    } else {
      return { success: false, message: "Erro ao atualizar ficha médica. Verifique os dados." };
    }
  } catch (error) {
    console.error("Erro ao atualizar ficha médica:", error);
    const mensagem =
      error.response?.data?.message || "Erro desconhecido ao atualizar ficha médica!";
    return { success: false, message: mensagem };
  }
};


export const deletarFichaMedica = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/ficha-medica/${id}`);  
    if (response.status === 200) {
      return { success: true, message: "Ficha médica deletada com sucesso!" };
    }
  } catch (error) {
    console.error("Erro ao deletar ficha médica:", error); 
    return { success: false, message: "Erro ao deletar ficha médica!" };
  }
};



export const buscarFichaMedica = async (id) => {
  try {


    const response = await axiosInstance.get(`/api/ficha-medica/paciente/${id}`);

    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {

      return { success: false, message: `Erro: Status de resposta ${response.status}` };
    }
  } catch (error) {


    if (error.response) {
    
      return { success: false, message: `Erro ao buscar ficha médica: ${error.response.data.message || error.response.statusText}` };
    } else if (error.request) {

      return { success: false, message: 'Erro de rede: Nenhuma resposta do servidor.' };
    } else {

      return { success: false, message: `Erro desconhecido: ${error.message}` };
    }
  }
};


export const buscarImagemFichaMedica = async (id) => {
  try {
    // Realiza a requisição para obter a imagem
    const response = await axiosInstance.get(`api/ficha-medica/paciente/${id}/imagem`, { responseType: 'arraybuffer' });

    if (response.status === 200) {

      return { success: true };
    } else {
      return { success: false, message: "Erro ao buscar imagem da ficha médica." };
    }
  } catch (error) {
    // Em caso de erro, loga o erro no console e extrai a mensagem de erro
    console.error("Erro ao buscar imagem da ficha médica:", error);
    const mensagem = error?.response?.data?.message || "Erro inesperado ao buscar imagem da ficha médica.";
    return { success: false, message: mensagem };
  }
};



export const buscarImagemFichaMedica2 = async (id) => {
  try {
    const response = await axiosInstance.get(`/ficha-medica/paciente/${id}/imagem`, { responseType: 'arraybuffer' });


    if (response.status === 200) {

      const arrayBufferView = new Uint8Array(response.data);
      const imageBase64 = btoa(String.fromCharCode(...arrayBufferView));

      return { success: true, image: `data:image/jpeg;base64,${imageBase64}` }; 
    } else {
      return { success: false, message: "Erro ao buscar imagem da ficha médica." };
    }
  } catch (error) {
    console.error("Erro ao buscar imagem da ficha médica:", error);
    if (error.response && error.response.data) {
      const mensagem =
        typeof error.response.data === "string"
          ? error.response.data
          : error.response.data.message || "Erro inesperado ao buscar imagem da ficha médica.";
      return { success: false, message: mensagem };
    }
    return { success: false, message: "Erro desconhecido ao buscar imagem da ficha médica!" };
  }
};

export const buscarImagemFichaMedica3 = async (id) => {
  try {
    const response = await fetch(`http://localhost:7070/ficha-medica/paciente/${id}/imagem`, {
      method: 'GET',
      headers: {
        'Accept': 'image/png'
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar a imagem');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    return url;

  } catch (error) {
    console.error('Erro ao carregar imagem da ficha médica:', error);
    return null;
  }
}


