using Agriculture_Equipment_Rental_System.Models;

namespace Agriculture_Equipment_Rental_System.Services.Interfaces
{
    public interface ITokenService
    {
        // Returns (token string, expiry time)
        (string Token, DateTime ExpiresAt) GenerateToken(User user);
    }
}
