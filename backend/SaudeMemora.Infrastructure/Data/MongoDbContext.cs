using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using SaudeMemora.Domain.Entities;

namespace SaudeMemora.Infrastructure.Data;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(IConfiguration configuration)
    {
        var connectionString = configuration.GetSection("MongoDbSettings:ConnectionString").Value;
        var databaseName = configuration.GetSection("MongoDbSettings:DatabaseName").Value;

        var client = new MongoClient(connectionString);
        _database = client.GetDatabase(databaseName);
    }

    public IMongoCollection<DocumentRecord> Documents => _database.GetCollection<DocumentRecord>("Documents");
    public IMongoCollection<Paciente> Pacientes => _database.GetCollection<Paciente>("Pacientes");
}
