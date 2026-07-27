namespace Agriculture_Equipment_Rental_System.Dto.Booking
{
    public class BookingResponseDto
    {
        public int BookingId { get; set; }

        public int FarmerId { get; set; }

        public string FarmerName { get; set; } = string.Empty;

        public int MachineryId { get; set; }

        public string MachineryName { get; set; } = string.Empty;

        public DateOnly BookingDate { get; set; }

        public DateOnly RentalStartDate { get; set; }

        public DateOnly RentalEndDate { get; set; }

        public decimal TotalAmount { get; set; }

        public string BookingStatus { get; set; } = string.Empty;
    }
}