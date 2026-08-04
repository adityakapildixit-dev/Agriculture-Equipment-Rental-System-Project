using Agriculture_Equipment_Rental_System.Dto.Booking;

namespace Agriculture_Equipment_Rental_System.Services.Interfaces
{
    public interface IBookingService
    {
        Task<ServiceResult<BookingResponseDto>> CreateBookingAsync(BookingCreateDto dto);
        Task<BookingResponseDto?> GetBookingAsync(int id);
        Task<List<BookingResponseDto>> GetAllBookingsAsync();
        Task<ServiceResult<bool>> UpdateBookingAsync(int id, BookingCreateDto dto);
        Task<ServiceResult<bool>> DeleteBookingAsync(int id);
    }
}
