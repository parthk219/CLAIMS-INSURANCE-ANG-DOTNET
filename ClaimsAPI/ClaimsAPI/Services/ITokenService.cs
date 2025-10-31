namespace ClaimsAPI.Services
{
    public interface ITokenService
    {
        string GenerateJwtToken(string email, string name);
    }
}