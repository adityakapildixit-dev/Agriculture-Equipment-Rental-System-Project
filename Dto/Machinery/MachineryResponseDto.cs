namespace Agriculture_Equipment_Rental_System.Dto.Machinery
{
    public class MachineryResponseDto
    {
        public int MachineryId { get; set; }
        public int OwnerId { get; set; }
        public string MachineName { get; set; }
        public string Brand { get; set; }
        public decimal DailyRate { get; set; }
        public string AvailabilityStatus { get; set; }
        public string Description { get; set; }
    }
}
