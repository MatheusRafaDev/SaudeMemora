using SaudeMemora.Application.DTOs;

namespace SaudeMemora.Application.Interfaces;

public interface IOcrAiService
{
    Task<ExtractedDocumentDto> ExtractDocumentDataAsync(string imageUrl, string documentType);
}

public class ExtractedDocumentDto
{
    public string Title { get; set; } = string.Empty;
    public string Doctor { get; set; } = string.Empty;
    public string Clinic { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Diagnosis { get; set; } = string.Empty;
    public List<ExtractedMedicineDto> Medicines { get; set; } = new();
    public string ExtractedText { get; set; } = string.Empty;
}

public class ExtractedMedicineDto
{
    public string Name { get; set; } = string.Empty;
    public string Dosage { get; set; } = string.Empty;
}
