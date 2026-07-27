using System;
using System.Collections.Generic;

namespace Agriculture_Equipment_Rental_System.Models;

public partial class Maintenance
{
    public int MaintenanceId { get; set; }

    public int MachineryId { get; set; }

    public DateOnly MaintenanceDate { get; set; }

    public string IssueDescription { get; set; } = null!;

    public decimal Cost { get; set; }

    public DateOnly NextServiceDate { get; set; }

    public string Status { get; set; } = null!;

    public virtual Machinery Machinery { get; set; } = null!;
}
