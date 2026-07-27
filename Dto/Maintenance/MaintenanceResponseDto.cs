namespace Agriculture_Equipment_Rental_System.Dto.Maintenance
{
    public class MaintenanceResponseDto
    {
        public int MaintenanceId { get; set; }

        public int MachineryId { get; set; }

        public string MachineryName { get; set; } = string.Empty;

        public DateOnly MaintenanceDate { get; set; }

        public string IssueDescription { get; set; } = string.Empty;

        public decimal Cost { get; set; }

        public DateOnly NextServiceDate { get; set; }

        public string Status { get; set; } = string.Empty;
    }
}