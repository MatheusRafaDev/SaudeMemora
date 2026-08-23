using SaudeMemora.Domain.Entities;

namespace SaudeMemora.Domain.Interfaces;

public interface IPacienteRepository
{
    Task<Paciente> CreateAsync(Paciente paciente);
    Task<Paciente?> GetByIdAsync(string id);
    Task<Paciente?> GetByEmailAsync(string email);
    Task<Paciente?> GetByCpfAsync(string cpf);
    Task UpdateAsync(Paciente paciente);
    Task DeleteAsync(string id);
}
