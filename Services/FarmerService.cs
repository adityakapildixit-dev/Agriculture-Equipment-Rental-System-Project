using Agriculture_Equipment_Rental_System.Data;
using Agriculture_Equipment_Rental_System.Dto.Farmer;
using Agriculture_Equipment_Rental_System.Models;
using Agriculture_Equipment_Rental_System.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Agriculture_Equipment_Rental_System.Services
{
    public class FarmerService : IFarmerService
    {
        private readonly AgriMachineryDbContext _context;

        public FarmerService(AgriMachineryDbContext context)
        {
            _context = context;
        }

        private static FarmerResponseDto ToDto(Farmer farmer)
        {
            return new FarmerResponseDto
            {
                FarmerId = farmer.FarmerId,
                FullName = farmer.FullName,
                MobileNo = farmer.MobileNo,
                Email = farmer.Email,
                Address = farmer.Address,
                Village = farmer.Village,
                State = farmer.State,
                AadhaarNo = farmer.AadhaarNo,
                RegistrationDate = farmer.RegistrationDate
            };
        }

        public async Task<FarmerResponseDto> CreateFarmerAsync(FarmerCreateDto dto)
        {
            var farmer = new Farmer
            {
                FullName = dto.FullName,
                MobileNo = dto.MobileNo,
                Email = dto.Email,
                Address = dto.Address,
                Village = dto.Village,
                State = dto.State,
                AadhaarNo = dto.AadhaarNo,
                RegistrationDate = dto.RegistrationDate
            };

            _context.Farmers.Add(farmer);
            await _context.SaveChangesAsync();

            return ToDto(farmer);
        }

        public async Task<FarmerResponseDto?> GetFarmerAsync(int id)
        {
            var farmer = await _context.Farmers.FindAsync(id);
            return farmer == null ? null : ToDto(farmer);
        }

        public async Task<List<FarmerResponseDto>> GetAllFarmersAsync()
        {
            return await _context.Farmers
                .Select(farmer => new FarmerResponseDto
                {
                    FarmerId = farmer.FarmerId,
                    FullName = farmer.FullName,
                    MobileNo = farmer.MobileNo,
                    Email = farmer.Email,
                    Address = farmer.Address,
                    Village = farmer.Village,
                    State = farmer.State,
                    AadhaarNo = farmer.AadhaarNo,
                    RegistrationDate = farmer.RegistrationDate
                })
                .ToListAsync();
        }

        public async Task<ServiceResult<bool>> UpdateFarmerAsync(int id, FarmerCreateDto dto)
        {
            var farmer = await _context.Farmers.FindAsync(id);
            if (farmer == null) return ServiceResult<bool>.AsNotFound();

            farmer.FullName = dto.FullName;
            farmer.MobileNo = dto.MobileNo;
            farmer.Email = dto.Email;
            farmer.Address = dto.Address;
            farmer.Village = dto.Village;
            farmer.State = dto.State;
            farmer.AadhaarNo = dto.AadhaarNo;
            farmer.RegistrationDate = dto.RegistrationDate;

            await _context.SaveChangesAsync();
            return ServiceResult<bool>.Ok(true);
        }

        public async Task<ServiceResult<bool>> DeleteFarmerAsync(int id)
        {
            var farmer = await _context.Farmers.FindAsync(id);
            if (farmer == null) return ServiceResult<bool>.AsNotFound();

            _context.Farmers.Remove(farmer);
            await _context.SaveChangesAsync();
            return ServiceResult<bool>.Ok(true);
        }
    }
}
