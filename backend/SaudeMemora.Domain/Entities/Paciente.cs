using System;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SaudeMemora.Domain.Entities
{
    public class MedicamentoContinuo
    {
        [BsonElement("nome")]
        public string Nome { get; set; } = string.Empty;

        [BsonElement("dosagem")]
        public string Dosagem { get; set; } = string.Empty;

        [BsonElement("horario")]
        public string Horario { get; set; } = string.Empty;
    }

    public class Paciente
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("nome")]
        [Required(ErrorMessage = "O nome é obrigatório.")]
        public string Nome { get; set; } = string.Empty;

        [BsonElement("cpf")]
        [Required(ErrorMessage = "O CPF é obrigatório.")]
        public string Cpf { get; set; } = string.Empty;

        [BsonElement("dataNascimento")]
        [Required(ErrorMessage = "A data de nascimento é obrigatória.")]
        public string DataNascimento { get; set; } = string.Empty;

        [BsonElement("sexo")]
        [Required(ErrorMessage = "O sexo é obrigatório.")]
        public string Sexo { get; set; } = string.Empty;

        [BsonElement("email")]
        [Required(ErrorMessage = "O email é obrigatório.")]
        [EmailAddress(ErrorMessage = "Email inválido.")]
        public string Email { get; set; } = string.Empty;

        [BsonElement("telefone")]
        public string? Telefone { get; set; }

        [BsonElement("endereco")]
        public string? Endereco { get; set; }

        [BsonElement("senha")]
        [Required(ErrorMessage = "A senha é obrigatória.")]
        [MinLength(6, ErrorMessage = "A senha deve ter no mínimo 6 caracteres.")]
        public string Senha { get; set; } = string.Empty;

        // Perfil médico
        [BsonElement("tipoSanguineo")]
        public string? TipoSanguineo { get; set; }

        [BsonElement("doadorOrgaos")]
        public bool DoadorOrgaos { get; set; } = false;

        [BsonElement("alergias")]
        public List<string> Alergias { get; set; } = new();

        [BsonElement("doencasCronicas")]
        public List<string> DoencasCronicas { get; set; } = new();

        [BsonElement("medicamentosContinuos")]
        public List<MedicamentoContinuo> MedicamentosContinuos { get; set; } = new();
    }
}


