using FluentValidation;
using SaudeMemora.Application.DTOs;
using SaudeMemora.Application.Interfaces;
using SaudeMemora.Infrastructure.Data;
using SaudeMemora.Infrastructure.Repositories;
using SaudeMemora.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();

builder.Services.AddSingleton<MongoDbContext>();
builder.Services.AddScoped<IDocumentRepository, DocumentRepository>();
builder.Services.AddScoped<IImageStorageService, CloudinaryStorageService>();

// Register FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<RegisterPacienteDto>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

// Auth Endpoints
app.MapPost("/api/auth/register", async (RegisterPacienteDto dto, IValidator<RegisterPacienteDto> validator) =>
{
    var validationResult = await validator.ValidateAsync(dto);
    if (!validationResult.IsValid)
    {
        return Results.BadRequest(validationResult.Errors);
    }
    return Results.Ok(new { Message = "Paciente registrado com sucesso!" });
});

app.MapPost("/api/auth/login", async (LoginPacienteDto dto, IValidator<LoginPacienteDto> validator) =>
{
    var validationResult = await validator.ValidateAsync(dto);
    if (!validationResult.IsValid)
    {
        return Results.BadRequest(validationResult.Errors);
    }
    return Results.Ok(new { Token = "dummy-jwt-token" });
});

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
