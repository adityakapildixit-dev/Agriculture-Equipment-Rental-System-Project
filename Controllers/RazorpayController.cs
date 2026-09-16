using Agriculture_Equipment_Rental_System.Dto.Payment;
using Agriculture_Equipment_Rental_System.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Agriculture_Equipment_Rental_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RazorpayController : ControllerBase
    {
        private readonly IRazorpayService _razorpayService;

        public RazorpayController(IRazorpayService razorpayService)
        {
            _razorpayService = razorpayService;
        }

        // POST api/Razorpay/create-order
        // Called right before opening Razorpay Checkout on the frontend.
        [HttpPost("create-order")]
        public async Task<IActionResult> CreateOrder(RazorpayOrderRequestDto dto)
        {
            var result = await _razorpayService.CreateOrderAsync(dto);
            if (!result.Success) return BadRequest(result.ErrorMessage);
            return Ok(result.Data);
        }

        // POST api/Razorpay/verify
        // Called after Razorpay Checkout reports a successful payment.
        // Verifies the signature, then creates the Payment + Invoice records.
        [HttpPost("verify")]
        public async Task<IActionResult> Verify(RazorpayVerifyDto dto)
        {
            var result = await _razorpayService.VerifyAndCompleteAsync(dto);
            if (!result.Success) return BadRequest(result.ErrorMessage);
            return Ok(result.Data);
        }
    }
}
