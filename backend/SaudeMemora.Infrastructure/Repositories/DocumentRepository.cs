using MongoDB.Driver;
using SaudeMemora.Application.Interfaces;
using SaudeMemora.Domain.Entities;
using SaudeMemora.Infrastructure.Data;

namespace SaudeMemora.Infrastructure.Repositories;

public class DocumentRepository : IDocumentRepository
{
    private readonly IMongoCollection<DocumentRecord> _documents;

    public DocumentRepository(MongoDbContext context)
    {
        _documents = context.Documents;
    }

    public async Task<DocumentRecord> CreateAsync(DocumentRecord document)
    {
        await _documents.InsertOneAsync(document);
        return document;
    }

    public async Task<DocumentRecord?> GetByIdAsync(string id)
    {
        return await _documents.Find(d => d.Id == id).FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<DocumentRecord>> GetAllByPatientIdAsync(string patientId)
    {
        return await _documents.Find(d => d.PatientId == patientId).ToListAsync();
    }

    public async Task UpdateAsync(DocumentRecord document)
    {
        await _documents.ReplaceOneAsync(d => d.Id == document.Id, document);
    }

    public async Task DeleteAsync(string id)
    {
        await _documents.DeleteOneAsync(d => d.Id == id);
    }
}
