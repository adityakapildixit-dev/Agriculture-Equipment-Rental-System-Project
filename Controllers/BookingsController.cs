using Agriculture_Equipment_Rental_System.Data;
using Agriculture_Equipment_Rental_System.Dto.Booking;
using Agriculture_Equipment_Rental_System.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Agriculture_Equipment_Rental_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly AgriMachineryDbContext _context;

        public BookingsController(AgriMachineryDbContext context)
        {
            _context = context;
        }

        // POST: api/Booking
        [HttpPost]
        public async Task<ActionResult<BookingResponseDto>> CreateBooking(BookingCreateDto dto)
        {
            var farmerExists = await _context.Farmers.AnyAsync(f => f.FarmerId == dto.FarmerId);
            if (!farmerExists) return BadRequest("Farmer not found.");

            var machineryExists = await _context.Machineries.AnyAsync(m => m.MachineryId == dto.MachineryId);
            if (!machineryExists) return BadRequest("Machinery not found.");

            var booking = new Booking
            {
                FarmerId = dto.FarmerId,
                MachineryId = dto.MachineryId,
                BookingDate = dto.BookingDate,
                RentalStartDate = dto.RentalStartDate,
                RentalEndDate = dto.RentalEndDate,
                TotalAmount = dto.TotalAmount,
                BookingStatus = dto.BookingStatus
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            var createdBooking = await _context.Bookings
                .Include(b => b.Farmer)
                .Include(b => b.Machinery)
                .FirstOrDefaultAsync(b => b.BookingId == booking.BookingId);

            if (createdBooking == null) return NotFound();

            var result = new BookingResponseDto
            {
                BookingId = createdBooking.BookingId,
                FarmerId = createdBooking.FarmerId,
                FarmerName = createdBooking.Farmer.FullName,
                MachineryId = createdBooking.MachineryId,
                MachineryName = createdBooking.Machinery.MachineName,
                BookingDate = createdBooking.BookingDate,
                RentalStartDate = createdBooking.RentalStartDate,
                RentalEndDate = createdBooking.RentalEndDate,
                TotalAmount = createdBooking.TotalAmount,
                BookingStatus = createdBooking.BookingStatus
            };

            return CreatedAtAction(nameof(GetBooking), new { id = booking.BookingId }, result);
        }

        // GET: api/Booking/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BookingResponseDto>> GetBooking(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.Farmer)
                .Include(b => b.Machinery)
                .FirstOrDefaultAsync(b => b.BookingId == id);

            if (booking == null) return NotFound();

            return new BookingResponseDto
            {
                BookingId = booking.BookingId,
                FarmerId = booking.FarmerId,
                FarmerName = booking.Farmer.FullName,
                MachineryId = booking.MachineryId,
                MachineryName = booking.Machinery.MachineName,
                BookingDate = booking.BookingDate,
                RentalStartDate = booking.RentalStartDate,
                RentalEndDate = booking.RentalEndDate,
                TotalAmount = booking.TotalAmount,
                BookingStatus = booking.BookingStatus
            };
        }

        // GET: api/Booking
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookingResponseDto>>> GetAllBookings()
        {
            return await _context.Bookings
                .Include(b => b.Farmer)
                .Include(b => b.Machinery)
                .Select(booking => new BookingResponseDto
                {
                    BookingId = booking.BookingId,
                    FarmerId = booking.FarmerId,
                    FarmerName = booking.Farmer.FullName,
                    MachineryId = booking.MachineryId,
                    MachineryName = booking.Machinery.MachineName,
                    BookingDate = booking.BookingDate,
                    RentalStartDate = booking.RentalStartDate,
                    RentalEndDate = booking.RentalEndDate,
                    TotalAmount = booking.TotalAmount,
                    BookingStatus = booking.BookingStatus
                })
                .ToListAsync();
        }

        // PUT: api/Booking/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBooking(int id, BookingCreateDto dto)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound();

            var farmerExists = await _context.Farmers.AnyAsync(f => f.FarmerId == dto.FarmerId);
            if (!farmerExists) return BadRequest("Farmer not found.");

            var machineryExists = await _context.Machineries.AnyAsync(m => m.MachineryId == dto.MachineryId);
            if (!machineryExists) return BadRequest("Machinery not found.");

            booking.FarmerId = dto.FarmerId;
            booking.MachineryId = dto.MachineryId;
            booking.BookingDate = dto.BookingDate;
            booking.RentalStartDate = dto.RentalStartDate;
            booking.RentalEndDate = dto.RentalEndDate;
            booking.TotalAmount = dto.TotalAmount;
            booking.BookingStatus = dto.BookingStatus;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Booking/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound();

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}