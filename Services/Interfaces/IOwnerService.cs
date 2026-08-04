using Agriculture_Equipment_Rental_System.Dto.Owner;

namespace Agriculture_Equipment_Rental_System.Services.Interfaces
{
    public interface IOwnerService
    {
        Task<OwnerResponseDto> CreateOwnerAsync(OwnerCreateDto dto);
        Task<OwnerResponseDto?> GetOwnerAsync(int id);
        Task<List<OwnerResponseDto>> GetAllOwnersAsync();
        Task<ServiceResult<bool>> UpdateOwnerAsync(int id, OwnerCreateDto dto);
        Task<ServiceResult<bool>> DeleteOwnerAsync(int id);
    }
}
