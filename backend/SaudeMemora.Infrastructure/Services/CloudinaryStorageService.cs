using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Configuration;
using SaudeMemora.Application.Interfaces;

namespace SaudeMemora.Infrastructure.Services;

public class CloudinaryStorageService : IImageStorageService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryStorageService(IConfiguration configuration)
    {
        var cloudName = Environment.GetEnvironmentVariable("CLOUDINARY_CLOUD_NAME") ?? configuration.GetSection("CloudinarySettings:CloudName").Value;
        var apiKey = Environment.GetEnvironmentVariable("CLOUDINARY_API_KEY") ?? configuration.GetSection("CloudinarySettings:ApiKey").Value;
        var apiSecret = Environment.GetEnvironmentVariable("CLOUDINARY_API_SECRET") ?? configuration.GetSection("CloudinarySettings:ApiSecret").Value;

        var account = new Account(cloudName, apiKey, apiSecret);
        _cloudinary = new Cloudinary(account);
    }

    public async Task<(string Url, string PublicId)> UploadImageAsync(Stream imageStream, string fileName)
    {
        // Se as chaves do Cloudinary não estiverem configuradas, usa um mock
        if (_cloudinary.Api.Account.Cloud == "YOUR_CLOUD_NAME" || string.IsNullOrWhiteSpace(_cloudinary.Api.Account.Cloud))
        {
            await Task.Delay(1000); // simula upload
            return ("https://via.placeholder.com/600x800.png?text=Documento+Mockado", "mock_public_id_12345");
        }

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(fileName, imageStream),
            Folder = "saude-memora"
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        if (uploadResult.Error != null)
        {
            throw new Exception($"Cloudinary upload failed: {uploadResult.Error.Message}");
        }

        return (uploadResult.SecureUrl.ToString(), uploadResult.PublicId);
    }

    public async Task<bool> DeleteImageAsync(string publicId)
    {
        var deletionParams = new DeletionParams(publicId);
        var result = await _cloudinary.DestroyAsync(deletionParams);

        return result.Result == "ok";
    }
}
