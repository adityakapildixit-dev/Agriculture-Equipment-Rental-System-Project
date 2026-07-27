using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Agriculture_Equipment_Rental_System.Models;
using Agriculture_Equipment_Rental_System.Data;

[Route("api/[controller]")]
[ApiController]
public class PaymentsController : ControllerBase
{
    private readonly AgriMachineryDbContext _context;
    public PaymentsController(AgriMachineryDbContext context)
    {
        _context = context;
    }

    // GET: api/Payment
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Payment>>> GetPayment()
    {
        return await _context.Payments.ToListAsync();
    }

    // GET: api/Payment/5
    [HttpGet("{paymentid}")]
    public async Task<ActionResult<Payment>> GetPayment(int paymentid)
    {
        var payment = await _context.Payments.FindAsync(paymentid);

        if (payment == null)
        {
            return NotFound();
        }

        return payment;
    }

    // PUT: api/Payment/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{paymentid}")]
    public async Task<IActionResult> PutPayment(int? paymentid, Payment payment)
    {
        if (paymentid != payment.PaymentId)
        {
            return BadRequest();
        }

        _context.Entry(payment).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PaymentExists(paymentid))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // POST: api/Payment
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<Payment>> PostPayment(Payment payment)
    {
        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetPayment", new { paymentid = payment.PaymentId }, payment);
    }

    // DELETE: api/Payment/5
    [HttpDelete("{paymentid}")]
    public async Task<IActionResult> DeletePayment(int? paymentid)
    {
        var payment = await _context.Payments.FindAsync(paymentid);
        if (payment == null)
        {
            return NotFound();
        }

        _context.Payments.Remove(payment);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool PaymentExists(int? paymentid)
    {
        return _context.Payments.Any(e => e.PaymentId == paymentid);
    }
}
