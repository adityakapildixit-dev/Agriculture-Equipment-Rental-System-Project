using System.ComponentModel.DataAnnotations;

namespace Agriculture_Equipment_Rental_System.Dto.Auth
{
    public class LoginDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
