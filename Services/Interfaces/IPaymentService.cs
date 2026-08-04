using Agriculture_Equipment_Rental_System.Models;

namespace Agriculture_Equipment_Rental_System.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<List<Payment>> GetAllPaymentsAsync();
        Task<Payment?> GetPaymentAsync(int paymentId);
        Task<ServiceResult<bool>> UpdatePaymentAsync(int? paymentId, Payment payment);
        Task<Payment> CreatePaymentAsync(Payment payment);
        Task<ServiceResult<bool>> DeletePaymentAsync(int? paymentId);
    }
}
