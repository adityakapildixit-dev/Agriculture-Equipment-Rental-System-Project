using Agriculture_Equipment_Rental_System.Dto.Farmer;

namespace Agriculture_Equipment_Rental_System.Services.Interfaces
{
    public interface IFarmerService
    {
        Task<FarmerResponseDto> CreateFarmerAsync(FarmerCreateDto dto);
        Task<FarmerResponseDto?> GetFarmerAsync(int id);
        Task<List<FarmerResponseDto>> GetAllFarmersAsync();
        Task<ServiceResult<bool>> UpdateFarmerAsync(int id, FarmerCreateDto dto);
        Task<ServiceResult<bool>> DeleteFarmerAsync(int id);
    }
}
