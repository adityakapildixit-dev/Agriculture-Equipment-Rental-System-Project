namespace Agriculture_Equipment_Rental_System.Dto.Payment
{
    // Everything the frontend needs to open the Razorpay Checkout widget.
    public class RazorpayOrderResponseDto
    {
        public string OrderId { get; set; } = null!;
        public int AmountInPaise { get; set; }
        public string Currency { get; set; } = "INR";
        public string KeyId { get; set; } = null!;
        public int BookingId { get; set; }
    }
}
