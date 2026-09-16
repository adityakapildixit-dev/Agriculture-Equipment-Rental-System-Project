using System.ComponentModel.DataAnnotations;

namespace Agriculture_Equipment_Rental_System.Dto.Payment
{
    // Sent by the frontend right before opening Razorpay Checkout.
    public class RazorpayOrderRequestDto
    {
        [Required]
        public int BookingId { get; set; }
    }
}
