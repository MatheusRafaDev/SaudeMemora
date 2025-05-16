import DocumentoService from "../services/DocumentoService";

import { processarReceita, processarExame, processarExameComImagem, processarProntuario,processarReceitaComImagem } from "./ProcessamentoDeTipoDoc";

import { useNavigate } from "react-router-dom";
export async function AdicionarDocumento(tipoDocumento, textoOCR, paciente, imagem,navigate ) {

  try {
    if (!tipoDocumento || !textoOCR || !paciente) {
      throw new Error("Dados insuficientes para processar o documento.");
    }

   
    const tipo = tipoDocumento.charAt(0).toUpperCase();

    const documentoData = {
      tipoDocumento: tipo,
      status: "Processado",
      dataUpload: new Date().toISOString().split("T")[0],
      paciente: { id: paciente.id }
    };

    const documentoResponse = await DocumentoService.create(documentoData);
    const documentoId = documentoResponse.data?.id;

    if (!documentoId) {
      throw new Error("Erro ao criar o documento: ID não retornado.");
    }

    // Passar a imagem para as funções específicas
    if (tipo === "R") return await processarReceitaComImagem(textoOCR, paciente, documentoId, imagem,navigate);
    if (tipo === "E") return await processarExameComImagem(textoOCR, paciente, documentoId, imagem,navigate);
    if (tipo === "P") return await processarProntuario(textoOCR, paciente, documentoId, imagem,navigate);

    throw new Error("Tipo de documento não suportado.");
  } catch (error) {
    console.error("❌ Erro ao processar o documento:", error.message);
    return { success: false, message: error.message };
  }
}