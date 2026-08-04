using Agriculture_Equipment_Rental_System.Dto.Machinery;

namespace Agriculture_Equipment_Rental_System.Services.Interfaces
{
    public interface IMachineryService
    {
        Task<ServiceResult<MachineryResponseDto>> CreateMachineryAsync(MachineryCreateDto dto);
        Task<MachineryResponseDto?> GetMachineryAsync(int id);
        Task<List<MachineryResponseDto>> GetAllMachineryAsync();
        Task<ServiceResult<bool>> UpdateMachineryAsync(int id, MachineryCreateDto dto);
        Task<ServiceResult<bool>> DeleteMachineryAsync(int id);
    }
}
