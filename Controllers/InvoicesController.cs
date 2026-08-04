using Agriculture_Equipment_Rental_System.Dto.Invoice;
using Agriculture_Equipment_Rental_System.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Agriculture_Equipment_Rental_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InvoicesController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;

        public InvoicesController(IInvoiceService invoiceService)
        {
            _invoiceService = invoiceService;
        }

        // POST: api/Invoice
        [HttpPost]
        public async Task<ActionResult<InvoiceResponseDto>> CreateInvoice(InvoiceCreateDto dto)
        {
            var result = await _invoiceService.CreateInvoiceAsync(dto);
            if (!result.Success) return BadRequest(result.ErrorMessage);
            return CreatedAtAction(nameof(GetInvoice), new { id = result.Data!.InvoiceId }, result.Data);
        }

        // GET: api/Invoice/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceResponseDto>> GetInvoice(int id)
        {
            var invoice = await _invoiceService.GetInvoiceAsync(id);
            if (invoice == null) return NotFound();
            return invoice;
        }

        // GET: api/Invoice
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvoiceResponseDto>>> GetAllInvoices()
        {
            return await _invoiceService.GetAllInvoicesAsync();
        }

        // PUT: api/Invoice/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInvoice(int id, InvoiceCreateDto dto)
        {
            var result = await _invoiceService.UpdateInvoiceAsync(id, dto);
            if (result.NotFound) return NotFound();
            if (!result.Success) return BadRequest(result.ErrorMessage);
            return NoContent();
        }

        // DELETE: api/Invoice/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoice(int id)
        {
            var result = await _invoiceService.DeleteInvoiceAsync(id);
            if (result.NotFound) return NotFound();
            return NoContent();
        }
    }
}
