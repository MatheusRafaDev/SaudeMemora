namespace SaudeMemora.Application.Interfaces;

public interface IImageStorageService
{
    Task<(string Url, string PublicId)> UploadImageAsync(Stream imageStream, string fileName);
    Task<bool> DeleteImageAsync(string publicId);
}
