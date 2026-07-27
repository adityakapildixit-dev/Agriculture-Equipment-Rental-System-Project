using System.ComponentModel.DataAnnotations;

namespace Agriculture_Equipment_Rental_System.Dto.Invoice
{
    public class InvoiceCreateDto
    {
        [Required]
        public int BookingId { get; set; }

        [Required]
        public DateOnly InvoiceDate { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }

        [Required]
        public decimal Gst { get; set; }

        [Required]
        public decimal Discount { get; set; }

        [Required]
        public decimal FinalAmount { get; set; }
    }
}