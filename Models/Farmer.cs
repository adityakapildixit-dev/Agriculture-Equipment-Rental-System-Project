using System;
using System.Collections.Generic;

namespace Agriculture_Equipment_Rental_System.Models;

public partial class Farmer
{
    public int FarmerId { get; set; }

    public string FullName { get; set; } = null!;

    public string MobileNo { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string Village { get; set; } = null!;

    public string State { get; set; } = null!;

    public string AadhaarNo { get; set; } = null!;

    public DateOnly RegistrationDate { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
