package com.pi.saudememora.config;

import com.pi.saudememora.service.IAService;
import com.pi.saudememora.service.OCRProcessor;
import com.pi.saudememora.service.OcrService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Value("${tesseract.data.path}")
    private String tessDataPath;

    @Value("${openrouter.api.key}")
    private String openRouterApiKey;

    @Value("${ocr.space.api.key}")
    private String ocrSpaceApiKey;

    @Bean
    public OcrService ocrService() {
        return new OcrService(tessDataPath, ocrSpaceApiKey);
    }

    @Bean
    public OCRProcessor ocrProcessor() {
        return new OCRProcessor(openRouterApiKey);
    }

    @Bean
    public IAService iaService(OCRProcessor ocrProcessor) {
        return new IAService(ocrProcessor);
    }
}
