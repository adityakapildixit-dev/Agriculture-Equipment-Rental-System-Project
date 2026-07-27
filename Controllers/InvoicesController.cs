using Agriculture_Equipment_Rental_System.Data;
using Agriculture_Equipment_Rental_System.Dto.Invoice;
using Agriculture_Equipment_Rental_System.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Agriculture_Equipment_Rental_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoicesController : ControllerBase
    {
        private readonly AgriMachineryDbContext _context;

        public InvoicesController(AgriMachineryDbContext context)
        {
            _context = context;
        }

        // POST: api/Invoice
        [HttpPost]
        public async Task<ActionResult<InvoiceResponseDto>> CreateInvoice(InvoiceCreateDto dto)
        {
            var bookingExists = await _context.Bookings.AnyAsync(b => b.BookingId == dto.BookingId);
            if (!bookingExists) return BadRequest("Booking not found.");

            var invoice = new Invoice
            {
                BookingId = dto.BookingId,
                InvoiceDate = dto.InvoiceDate,
                TotalAmount = dto.TotalAmount,
                Gst = dto.Gst,
                Discount = dto.Discount,
                FinalAmount = dto.FinalAmount
            };

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            var result = new InvoiceResponseDto
            {
                InvoiceId = invoice.InvoiceId,
                BookingId = invoice.BookingId,
                InvoiceDate = invoice.InvoiceDate,
                TotalAmount = invoice.TotalAmount,
                Gst = invoice.Gst,
                Discount = invoice.Discount,
                FinalAmount = invoice.FinalAmount
            };

            return CreatedAtAction(nameof(GetInvoice), new { id = invoice.InvoiceId }, result);
        }

        // GET: api/Invoice/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceResponseDto>> GetInvoice(int id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null) return NotFound();

            return new InvoiceResponseDto
            {
                InvoiceId = invoice.InvoiceId,
                BookingId = invoice.BookingId,
                InvoiceDate = invoice.InvoiceDate,
                TotalAmount = invoice.TotalAmount,
                Gst = invoice.Gst,
                Discount = invoice.Discount,
                FinalAmount = invoice.FinalAmount
            };
        }

        // GET: api/Invoice
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvoiceResponseDto>>> GetAllInvoices()
        {
            return await _context.Invoices
                .Select(invoice => new InvoiceResponseDto
                {
                    InvoiceId = invoice.InvoiceId,
                    BookingId = invoice.BookingId,
                    InvoiceDate = invoice.InvoiceDate,
                    TotalAmount = invoice.TotalAmount,
                    Gst = invoice.Gst,
                    Discount = invoice.Discount,
                    FinalAmount = invoice.FinalAmount
                })
                .ToListAsync();
        }

        // PUT: api/Invoice/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInvoice(int id, InvoiceCreateDto dto)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null) return NotFound();

            var bookingExists = await _context.Bookings.AnyAsync(b => b.BookingId == dto.BookingId);
            if (!bookingExists) return BadRequest("Booking not found.");

            invoice.BookingId = dto.BookingId;
            invoice.InvoiceDate = dto.InvoiceDate;
            invoice.TotalAmount = dto.TotalAmount;
            invoice.Gst = dto.Gst;
            invoice.Discount = dto.Discount;
            invoice.FinalAmount = dto.FinalAmount;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Invoice/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoice(int id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null) return NotFound();

            _context.Invoices.Remove(invoice);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}