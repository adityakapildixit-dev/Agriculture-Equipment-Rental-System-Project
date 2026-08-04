using Agriculture_Equipment_Rental_System.Dto.Maintenance;

namespace Agriculture_Equipment_Rental_System.Services.Interfaces
{
    public interface IMaintenanceService
    {
        Task<ServiceResult<MaintenanceResponseDto>> CreateMaintenanceAsync(MaintenanceCreateDto dto);
        Task<MaintenanceResponseDto?> GetMaintenanceAsync(int id);
        Task<List<MaintenanceResponseDto>> GetAllMaintenancesAsync();
        Task<ServiceResult<bool>> UpdateMaintenanceAsync(int id, MaintenanceCreateDto dto);
        Task<ServiceResult<bool>> DeleteMaintenanceAsync(int id);
    }
}
