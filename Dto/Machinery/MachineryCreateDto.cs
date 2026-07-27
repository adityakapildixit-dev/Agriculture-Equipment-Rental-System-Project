namespace Agriculture_Equipment_Rental_System.Dto.Machinery
{
    public class MachineryCreateDto
    {
        public int OwnerId { get; set; }
        public string MachineName { get; set; }
        public string Brand { get; set; }
        public int DailyRate { get; set; }
        public string AvailabilityStatus { get; set; }
        public string Description { get; set; }
    }
}
