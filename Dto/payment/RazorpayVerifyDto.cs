using System.ComponentModel.DataAnnotations;

namespace Agriculture_Equipment_Rental_System.Dto.Payment
{
    // What Razorpay Checkout hands back to the frontend after a successful
    // payment, forwarded here so the backend can verify it really came from
    // Razorpay before trusting it.
    public class RazorpayVerifyDto
    {
        [Required]
        public int BookingId { get; set; }

        [Required]
        public string RazorpayOrderId { get; set; } = null!;

        [Required]
        public string RazorpayPaymentId { get; set; } = null!;

        [Required]
        public string RazorpaySignature { get; set; } = null!;
    }
}
