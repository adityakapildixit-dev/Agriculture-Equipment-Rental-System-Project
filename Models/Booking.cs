using System;
using System.Collections.Generic;

namespace Agriculture_Equipment_Rental_System.Models;

public partial class Booking
{
    public int BookingId { get; set; }

    public int FarmerId { get; set; }

    public int MachineryId { get; set; }

    public DateOnly BookingDate { get; set; }

    public DateOnly RentalStartDate { get; set; }

    public DateOnly RentalEndDate { get; set; }

    public decimal TotalAmount { get; set; }

    public string BookingStatus { get; set; } = null!;

    public virtual Farmer Farmer { get; set; } = null!;

    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();

    public virtual Machinery Machinery { get; set; } = null!;

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
