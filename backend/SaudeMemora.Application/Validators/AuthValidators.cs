using FluentValidation;
using SaudeMemora.Application.DTOs;

namespace SaudeMemora.Application.Validators
{
    public class RegisterPacienteValidator : AbstractValidator<RegisterPacienteDto>
    {
        public RegisterPacienteValidator()
        {
            RuleFor(x => x.Nome)
                .NotEmpty().WithMessage("O nome é obrigatório.")
                .Length(3, 100).WithMessage("O nome deve ter entre 3 e 100 caracteres.");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("O email é obrigatório.")
                .EmailAddress().WithMessage("Email inválido.");

            RuleFor(x => x.Senha)
                .NotEmpty().WithMessage("A senha é obrigatória.")
                .MinimumLength(6).WithMessage("A senha deve ter no mínimo 6 caracteres.");

            RuleFor(x => x.Cpf)
                .NotEmpty().WithMessage("O CPF é obrigatório.")
                .Matches(@"^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$").WithMessage("Formato de CPF inválido.");
        }
    }

    public class LoginPacienteValidator : AbstractValidator<LoginPacienteDto>
    {
        public LoginPacienteValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("O email é obrigatório.")
                .EmailAddress().WithMessage("Email inválido.");

            RuleFor(x => x.Senha)
                .NotEmpty().WithMessage("A senha é obrigatória.");
        }
    }
}
