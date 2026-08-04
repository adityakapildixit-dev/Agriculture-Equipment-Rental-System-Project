using Agriculture_Equipment_Rental_System.Dto.Auth;

namespace Agriculture_Equipment_Rental_System.Services.Interfaces
{
    public interface IAuthService
    {
        Task<ServiceResult<AuthResponseDto>> RegisterAsync(RegisterDto dto);
        Task<ServiceResult<AuthResponseDto>> LoginAsync(LoginDto dto);
    }
}
