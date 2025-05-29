package com.pi.saudememora.service;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

public class OcrService {

    private final Tesseract tesseract;
    private final String ocrSpaceApiKey;

    // Construtor sem OCR Space key (se você só quiser usar Tesseract local)
    public OcrService(String tessDataPath) {
        this(tessDataPath, null);
    }

    // Construtor completo com OCR Space API Key (pode ser null)
    public OcrService(String tessDataPath, String ocrSpaceApiKey) {
        this.ocrSpaceApiKey = ocrSpaceApiKey;

        this.tesseract = new Tesseract();
        configureTesseract(tessDataPath);
    }

    private void configureTesseract(String tessDataPath) {
        tesseract.setDatapath(tessDataPath);
        tesseract.setLanguage("por");
        tesseract.setPageSegMode(3);
        tesseract.setTessVariable("tessedit_char_whitelist",
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,-/ ");
    }

    public String processarOCRLocal(MultipartFile arquivo) throws TesseractException, IOException {
        File tempFile = File.createTempFile("ocr-", ".tmp");
        try {
            arquivo.transferTo(tempFile);
            return tesseract.doOCR(tempFile);
        } finally {
            tempFile.delete();
        }
    }

    // Aqui você pode implementar a chamada para o OCR Space API, usando a ocrSpaceApiKey
    // Exemplo básico de método (você deve implementar a chamada HTTP real):
    public String processarOCRViaOCRSpaceAPI(MultipartFile arquivo) {
        if (ocrSpaceApiKey == null) {
            throw new IllegalStateException("API key do OCR Space não configurada.");
        }

        // Aqui vai o código para enviar a imagem para o OCR Space via HTTP e retornar o texto.
        // Pode usar HttpClient, RestTemplate, WebClient, etc.

        return ""; // retornar o texto extraído do OCR Space API
    }
}
