using System;
using System.Collections.Generic;

namespace Agriculture_Equipment_Rental_System.Models;

public partial class Invoice
{
    public int InvoiceId { get; set; }

    public int BookingId { get; set; }

    public DateOnly InvoiceDate { get; set; }

    public decimal TotalAmount { get; set; }

    public decimal Gst { get; set; }

    public decimal Discount { get; set; }

    public decimal FinalAmount { get; set; }

    public virtual Booking Booking { get; set; } = null!;
}
