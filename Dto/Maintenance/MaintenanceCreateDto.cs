using System.ComponentModel.DataAnnotations;

namespace Agriculture_Equipment_Rental_System.Dto.Maintenance
{
    public class MaintenanceCreateDto
    {
        [Required]
        public int MachineryId { get; set; }

        [Required]
        public DateOnly MaintenanceDate { get; set; }

        [Required]
        public string IssueDescription { get; set; } = string.Empty;

        [Required]
        public decimal Cost { get; set; }

        [Required]
        public DateOnly NextServiceDate { get; set; }

        [Required]
        public string Status { get; set; } = string.Empty;
    }
}