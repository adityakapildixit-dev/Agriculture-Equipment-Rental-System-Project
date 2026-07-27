using System;
using System.Collections.Generic;

namespace Agriculture_Equipment_Rental_System.Models;

public partial class Owner
{
    public int OwnerId { get; set; }

    public string OwnerName { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string BankAccountNo { get; set; } = null!;

    public virtual ICollection<Machinery> Machineries { get; set; } = new List<Machinery>();
}
