using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Agriculture_Equipment_Rental_System.Models;
using Agriculture_Equipment_Rental_System.Services.Interfaces;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    // GET: api/Payment
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Payment>>> GetPayment()
    {
        return await _paymentService.GetAllPaymentsAsync();
    }

    // GET: api/Payment/5
    [HttpGet("{paymentid}")]
    public async Task<ActionResult<Payment>> GetPayment(int paymentid)
    {
        var payment = await _paymentService.GetPaymentAsync(paymentid);
        if (payment == null) return NotFound();
        return payment;
    }

    // PUT: api/Payment/5
    [HttpPut("{paymentid}")]
    public async Task<IActionResult> PutPayment(int? paymentid, Payment payment)
    {
        var result = await _paymentService.UpdatePaymentAsync(paymentid, payment);
        if (result.NotFound) return NotFound();
        if (!result.Success) return BadRequest(result.ErrorMessage);
        return NoContent();
    }

    // POST: api/Payment
    [HttpPost]
    public async Task<ActionResult<Payment>> PostPayment(Payment payment)
    {
        var created = await _paymentService.CreatePaymentAsync(payment);
        return CreatedAtAction("GetPayment", new { paymentid = created.PaymentId }, created);
    }

    // DELETE: api/Payment/5
    [HttpDelete("{paymentid}")]
    public async Task<IActionResult> DeletePayment(int? paymentid)
    {
        var result = await _paymentService.DeletePaymentAsync(paymentid);
        if (result.NotFound) return NotFound();
        return NoContent();
    }
}
