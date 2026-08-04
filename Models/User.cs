using System;

namespace Agriculture_Equipment_Rental_System.Models;

public partial class User
{
    public int UserId { get; set; }

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    // "Admin", "Owner", or "Farmer"
    public string Role { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
}
