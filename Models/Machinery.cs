using System;
using System.Collections.Generic;

namespace Agriculture_Equipment_Rental_System.Models;

public partial class Machinery
{
    public int MachineryId { get; set; }

    public int OwnerId { get; set; }

    public string MachineName { get; set; } = null!;

    public string Brand { get; set; } = null!;

    public int DailyRate { get; set; }

    public string AvailabilityStatus { get; set; } = null!;

    public string Description { get; set; } = null!;

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual ICollection<Maintenance> Maintenances { get; set; } = new List<Maintenance>();

    public virtual Owner Owner { get; set; } = null!;
}
