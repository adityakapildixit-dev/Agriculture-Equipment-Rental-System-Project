using Agriculture_Equipment_Rental_System.Data;
using Agriculture_Equipment_Rental_System.Dto.Auth;
using Agriculture_Equipment_Rental_System.Models;
using Agriculture_Equipment_Rental_System.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Agriculture_Equipment_Rental_System.Services
{
    public class AuthService : IAuthService
    {
        private readonly AgriMachineryDbContext _context;
        private readonly ITokenService _tokenService;

        private static readonly string[] ValidRoles = { "Admin", "Owner", "Farmer" };

        public AuthService(AgriMachineryDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        public async Task<ServiceResult<AuthResponseDto>> RegisterAsync(RegisterDto dto)
        {
            if (!ValidRoles.Contains(dto.Role))
                return ServiceResult<AuthResponseDto>.Fail("Role must be Admin, Owner, or Farmer.");

            var usernameTaken = await _context.Users.AnyAsync(u => u.Username == dto.Username);
            if (usernameTaken) return ServiceResult<AuthResponseDto>.Fail("Username already taken.");

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = PasswordHasher.Hash(dto.Password),
                Role = dto.Role,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var (token, expiresAt) = _tokenService.GenerateToken(user);

            return ServiceResult<AuthResponseDto>.Ok(new AuthResponseDto
            {
                UserId = user.UserId,
                Username = user.Username,
                Role = user.Role,
                Token = token,
                ExpiresAt = expiresAt
            });
        }

        public async Task<ServiceResult<AuthResponseDto>> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);
            if (user == null) return ServiceResult<AuthResponseDto>.Fail("Invalid username or password.");

            var passwordOk = PasswordHasher.Verify(dto.Password, user.PasswordHash);
            if (!passwordOk) return ServiceResult<AuthResponseDto>.Fail("Invalid username or password.");

            var (token, expiresAt) = _tokenService.GenerateToken(user);

            return ServiceResult<AuthResponseDto>.Ok(new AuthResponseDto
            {
                UserId = user.UserId,
                Username = user.Username,
                Role = user.Role,
                Token = token,
                ExpiresAt = expiresAt
            });
        }
    }
}
