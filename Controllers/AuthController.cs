using Agriculture_Equipment_Rental_System.Dto.Auth;
using Agriculture_Equipment_Rental_System.Services.Interfaces;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Agriculture_Equipment_Rental_System.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
        {
            var result = await _authService.RegisterAsync(dto);
            if (!result.Success) return BadRequest(result.ErrorMessage);
            return Ok(result.Data);
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            if (!result.Success) return Unauthorized(result.ErrorMessage);
            return Ok(result.Data);
        }
    }
}
