namespace Agriculture_Equipment_Rental_System.Dto.Invoice
{
    public class InvoiceResponseDto
    {
        public int InvoiceId { get; set; }

        public int BookingId { get; set; }

        public DateOnly InvoiceDate { get; set; }

        public decimal TotalAmount { get; set; }

        public decimal Gst { get; set; }

        public decimal Discount { get; set; }

        public decimal FinalAmount { get; set; }
    }
}