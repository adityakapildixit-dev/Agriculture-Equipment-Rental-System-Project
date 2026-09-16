namespace Agriculture_Equipment_Rental_System.Dto.Payment
{
    // Returned after a verified payment -- the Payment and Invoice that were
    // just created for the booking.
    public class RazorpayVerifyResponseDto
    {
        public int PaymentId { get; set; }
        public string PaymentStatus { get; set; } = null!;
        public int InvoiceId { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal Gst { get; set; }
        public decimal Discount { get; set; }
        public decimal FinalAmount { get; set; }
    }
}
