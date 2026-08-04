using Agriculture_Equipment_Rental_System.Data;
using Agriculture_Equipment_Rental_System.Dto.Booking;
using Agriculture_Equipment_Rental_System.Models;
using Agriculture_Equipment_Rental_System.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Agriculture_Equipment_Rental_System.Services
{
    public class BookingService : IBookingService
    {
        private readonly AgriMachineryDbContext _context;

        public BookingService(AgriMachineryDbContext context)
        {
            _context = context;
        }

        private static BookingResponseDto ToDto(Booking booking)
        {
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

        public async Task<ServiceResult<BookingResponseDto>> CreateBookingAsync(BookingCreateDto dto)
        {
            var farmerExists = await _context.Farmers.AnyAsync(f => f.FarmerId == dto.FarmerId);
            if (!farmerExists) return ServiceResult<BookingResponseDto>.Fail("Farmer not found.");

            var machineryExists = await _context.Machineries.AnyAsync(m => m.MachineryId == dto.MachineryId);
            if (!machineryExists) return ServiceResult<BookingResponseDto>.Fail("Machinery not found.");

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

            return ServiceResult<BookingResponseDto>.Ok(ToDto(createdBooking!));
        }

        public async Task<BookingResponseDto?> GetBookingAsync(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.Farmer)
                .Include(b => b.Machinery)
                .FirstOrDefaultAsync(b => b.BookingId == id);

            return booking == null ? null : ToDto(booking);
        }

        public async Task<List<BookingResponseDto>> GetAllBookingsAsync()
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

        public async Task<ServiceResult<bool>> UpdateBookingAsync(int id, BookingCreateDto dto)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return ServiceResult<bool>.AsNotFound();

            var farmerExists = await _context.Farmers.AnyAsync(f => f.FarmerId == dto.FarmerId);
            if (!farmerExists) return ServiceResult<bool>.Fail("Farmer not found.");

            var machineryExists = await _context.Machineries.AnyAsync(m => m.MachineryId == dto.MachineryId);
            if (!machineryExists) return ServiceResult<bool>.Fail("Machinery not found.");

            booking.FarmerId = dto.FarmerId;
            booking.MachineryId = dto.MachineryId;
            booking.BookingDate = dto.BookingDate;
            booking.RentalStartDate = dto.RentalStartDate;
            booking.RentalEndDate = dto.RentalEndDate;
            booking.TotalAmount = dto.TotalAmount;
            booking.BookingStatus = dto.BookingStatus;

            await _context.SaveChangesAsync();
            return ServiceResult<bool>.Ok(true);
        }

        public async Task<ServiceResult<bool>> DeleteBookingAsync(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return ServiceResult<bool>.AsNotFound();

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();
            return ServiceResult<bool>.Ok(true);
        }
    }
}
