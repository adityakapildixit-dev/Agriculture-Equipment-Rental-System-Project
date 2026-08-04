using Agriculture_Equipment_Rental_System.Dto.Invoice;

namespace Agriculture_Equipment_Rental_System.Services.Interfaces
{
    public interface IInvoiceService
    {
        Task<ServiceResult<InvoiceResponseDto>> CreateInvoiceAsync(InvoiceCreateDto dto);
        Task<InvoiceResponseDto?> GetInvoiceAsync(int id);
        Task<List<InvoiceResponseDto>> GetAllInvoicesAsync();
        Task<ServiceResult<bool>> UpdateInvoiceAsync(int id, InvoiceCreateDto dto);
        Task<ServiceResult<bool>> DeleteInvoiceAsync(int id);
    }
}
