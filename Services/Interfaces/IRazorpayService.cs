using Agriculture_Equipment_Rental_System.Dto.Payment;

namespace Agriculture_Equipment_Rental_System.Services.Interfaces
{
    public interface IRazorpayService
    {
        Task<ServiceResult<RazorpayOrderResponseDto>> CreateOrderAsync(RazorpayOrderRequestDto dto);
        Task<ServiceResult<RazorpayVerifyResponseDto>> VerifyAndCompleteAsync(RazorpayVerifyDto dto);
    }
}
