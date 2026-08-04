using Agriculture_Equipment_Rental_System.Dto.Booking;
using Agriculture_Equipment_Rental_System.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Agriculture_Equipment_Rental_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingsController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        // POST: api/Booking
        [HttpPost]
        public async Task<ActionResult<BookingResponseDto>> CreateBooking(BookingCreateDto dto)
        {
            var result = await _bookingService.CreateBookingAsync(dto);
            if (!result.Success) return BadRequest(result.ErrorMessage);
            return CreatedAtAction(nameof(GetBooking), new { id = result.Data!.BookingId }, result.Data);
        }

        // GET: api/Booking/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BookingResponseDto>> GetBooking(int id)
        {
            var booking = await _bookingService.GetBookingAsync(id);
            if (booking == null) return NotFound();
            return booking;
        }

        // GET: api/Booking
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookingResponseDto>>> GetAllBookings()
        {
            return await _bookingService.GetAllBookingsAsync();
        }

        // PUT: api/Booking/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBooking(int id, BookingCreateDto dto)
        {
            var result = await _bookingService.UpdateBookingAsync(id, dto);
            if (result.NotFound) return NotFound();
            if (!result.Success) return BadRequest(result.ErrorMessage);
            return NoContent();
        }

        // DELETE: api/Booking/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var result = await _bookingService.DeleteBookingAsync(id);
            if (result.NotFound) return NotFound();
            return NoContent();
        }
    }
}
