import DocumentoService from "../services/DocumentoService";

import { processarReceita, processarExame, processarProntuario } from "./ProcessamentoDeTipoDoc";


export async function AdicionarDocumento(tipoDocumento, textoOCR, paciente) {
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

    if (tipo === "R") return await processarReceita(textoOCR, paciente, documentoId);
    if (tipo === "E") return await processarExame(textoOCR, paciente, documentoId);
    if (tipo === "P") return await processarProntuario(textoOCR, paciente, documentoId);

  } catch (error) {
    console.error("❌ Erro ao processar o documento:", error.message);
    return { success: false, message: error.message };
  }
}
