using Agriculture_Equipment_Rental_System.Data;
using Agriculture_Equipment_Rental_System.Dto.Machinery;
using Agriculture_Equipment_Rental_System.Models;
using Agriculture_Equipment_Rental_System.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Agriculture_Equipment_Rental_System.Services
{
    public class MachineryService : IMachineryService
    {
        private readonly AgriMachineryDbContext _context;

        public MachineryService(AgriMachineryDbContext context)
        {
            _context = context;
        }

        private static MachineryResponseDto ToDto(Machinery machinery)
        {
            return new MachineryResponseDto
            {
                MachineryId = machinery.MachineryId,
                OwnerId = machinery.OwnerId,
                MachineName = machinery.MachineName,
                Brand = machinery.Brand,
                DailyRate = machinery.DailyRate,
                AvailabilityStatus = machinery.AvailabilityStatus,
                Description = machinery.Description
            };
        }

        public async Task<ServiceResult<MachineryResponseDto>> CreateMachineryAsync(MachineryCreateDto dto)
        {
            var ownerExists = await _context.Owners.AnyAsync(o => o.OwnerId == dto.OwnerId);
            if (!ownerExists) return ServiceResult<MachineryResponseDto>.Fail("Owner not found.");

            var machinery = new Machinery
            {
                OwnerId = dto.OwnerId,
                MachineName = dto.MachineName,
                Brand = dto.Brand,
                DailyRate = dto.DailyRate,
                AvailabilityStatus = dto.AvailabilityStatus,
                Description = dto.Description
            };

            _context.Machineries.Add(machinery);
            await _context.SaveChangesAsync();

            return ServiceResult<MachineryResponseDto>.Ok(ToDto(machinery));
        }

        public async Task<MachineryResponseDto?> GetMachineryAsync(int id)
        {
            var machinery = await _context.Machineries.FindAsync(id);
            return machinery == null ? null : ToDto(machinery);
        }

        public async Task<List<MachineryResponseDto>> GetAllMachineryAsync()
        {
            return await _context.Machineries
                .Select(m => new MachineryResponseDto
                {
                    MachineryId = m.MachineryId,
                    OwnerId = m.OwnerId,
                    MachineName = m.MachineName,
                    Brand = m.Brand,
                    DailyRate = m.DailyRate,
                    AvailabilityStatus = m.AvailabilityStatus,
                    Description = m.Description
                })
                .ToListAsync();
        }

        public async Task<ServiceResult<bool>> UpdateMachineryAsync(int id, MachineryCreateDto dto)
        {
            var machinery = await _context.Machineries.FindAsync(id);
            if (machinery == null) return ServiceResult<bool>.AsNotFound();

            machinery.MachineName = dto.MachineName;
            machinery.Brand = dto.Brand;
            machinery.DailyRate = dto.DailyRate;
            machinery.AvailabilityStatus = dto.AvailabilityStatus;
            machinery.Description = dto.Description;

            await _context.SaveChangesAsync();
            return ServiceResult<bool>.Ok(true);
        }

        public async Task<ServiceResult<bool>> DeleteMachineryAsync(int id)
        {
            var machinery = await _context.Machineries.FindAsync(id);
            if (machinery == null) return ServiceResult<bool>.AsNotFound();

            _context.Machineries.Remove(machinery);
            await _context.SaveChangesAsync();
            return ServiceResult<bool>.Ok(true);
        }
    }
}
