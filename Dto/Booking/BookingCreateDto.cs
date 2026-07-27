using System.ComponentModel.DataAnnotations;

namespace Agriculture_Equipment_Rental_System.Dto.Booking
{
    public class BookingCreateDto
    {
        [Required]
        public int FarmerId { get; set; }

        [Required]
        public int MachineryId { get; set; }

        [Required]
        public DateOnly BookingDate { get; set; }

        [Required]
        public DateOnly RentalStartDate { get; set; }

        [Required]
        public DateOnly RentalEndDate { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }

        [Required]
        public string BookingStatus { get; set; } = string.Empty;
    }
}