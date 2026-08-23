using SaudeMemora.Domain.Entities;

namespace SaudeMemora.Application.Interfaces;

public interface IDocumentRepository
{
    Task<DocumentRecord> CreateAsync(DocumentRecord document);
    Task<DocumentRecord?> GetByIdAsync(string id);
    Task<IEnumerable<DocumentRecord>> GetAllByPatientIdAsync(string patientId);
    Task UpdateAsync(DocumentRecord document);
    Task DeleteAsync(string id);
}
