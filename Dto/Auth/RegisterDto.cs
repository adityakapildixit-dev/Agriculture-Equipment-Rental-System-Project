using System.ComponentModel.DataAnnotations;

namespace Agriculture_Equipment_Rental_System.Dto.Auth
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        // Must be "Admin", "Owner", or "Farmer"
        [Required]
        public string Role { get; set; } = string.Empty;
    }
}
