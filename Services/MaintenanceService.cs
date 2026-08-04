using Agriculture_Equipment_Rental_System.Data;
using Agriculture_Equipment_Rental_System.Dto.Maintenance;
using Agriculture_Equipment_Rental_System.Models;
using Agriculture_Equipment_Rental_System.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Agriculture_Equipment_Rental_System.Services
{
    public class MaintenanceService : IMaintenanceService
    {
        private readonly AgriMachineryDbContext _context;

        public MaintenanceService(AgriMachineryDbContext context)
        {
            _context = context;
        }

        private static MaintenanceResponseDto ToDto(Maintenance maintenance)
        {
            return new MaintenanceResponseDto
            {
                MaintenanceId = maintenance.MaintenanceId,
                MachineryId = maintenance.MachineryId,
                MachineryName = maintenance.Machinery.MachineName,
                MaintenanceDate = maintenance.MaintenanceDate,
                IssueDescription = maintenance.IssueDescription,
                Cost = maintenance.Cost,
                NextServiceDate = maintenance.NextServiceDate,
                Status = maintenance.Status
            };
        }

        public async Task<ServiceResult<MaintenanceResponseDto>> CreateMaintenanceAsync(MaintenanceCreateDto dto)
        {
            var machineryExists = await _context.Machineries.AnyAsync(m => m.MachineryId == dto.MachineryId);
            if (!machineryExists) return ServiceResult<MaintenanceResponseDto>.Fail("Machinery not found.");

            var maintenance = new Maintenance
            {
                MachineryId = dto.MachineryId,
                MaintenanceDate = dto.MaintenanceDate,
                IssueDescription = dto.IssueDescription,
                Cost = dto.Cost,
                NextServiceDate = dto.NextServiceDate,
                Status = dto.Status
            };

            _context.Maintenances.Add(maintenance);
            await _context.SaveChangesAsync();

            var createdMaintenance = await _context.Maintenances
                .Include(m => m.Machinery)
                .FirstOrDefaultAsync(m => m.MaintenanceId == maintenance.MaintenanceId);

            return ServiceResult<MaintenanceResponseDto>.Ok(ToDto(createdMaintenance!));
        }

        public async Task<MaintenanceResponseDto?> GetMaintenanceAsync(int id)
        {
            var maintenance = await _context.Maintenances
                .Include(m => m.Machinery)
                .FirstOrDefaultAsync(m => m.MaintenanceId == id);

            return maintenance == null ? null : ToDto(maintenance);
        }

        public async Task<List<MaintenanceResponseDto>> GetAllMaintenancesAsync()
        {
            return await _context.Maintenances
                .Include(m => m.Machinery)
                .Select(maintenance => new MaintenanceResponseDto
                {
                    MaintenanceId = maintenance.MaintenanceId,
                    MachineryId = maintenance.MachineryId,
                    MachineryName = maintenance.Machinery.MachineName,
                    MaintenanceDate = maintenance.MaintenanceDate,
                    IssueDescription = maintenance.IssueDescription,
                    Cost = maintenance.Cost,
                    NextServiceDate = maintenance.NextServiceDate,
                    Status = maintenance.Status
                })
                .ToListAsync();
        }

        public async Task<ServiceResult<bool>> UpdateMaintenanceAsync(int id, MaintenanceCreateDto dto)
        {
            var maintenance = await _context.Maintenances.FindAsync(id);
            if (maintenance == null) return ServiceResult<bool>.AsNotFound();

            var machineryExists = await _context.Machineries.AnyAsync(m => m.MachineryId == dto.MachineryId);
            if (!machineryExists) return ServiceResult<bool>.Fail("Machinery not found.");

            maintenance.MachineryId = dto.MachineryId;
            maintenance.MaintenanceDate = dto.MaintenanceDate;
            maintenance.IssueDescription = dto.IssueDescription;
            maintenance.Cost = dto.Cost;
            maintenance.NextServiceDate = dto.NextServiceDate;
            maintenance.Status = dto.Status;

            await _context.SaveChangesAsync();
            return ServiceResult<bool>.Ok(true);
        }

        public async Task<ServiceResult<bool>> DeleteMaintenanceAsync(int id)
        {
            var maintenance = await _context.Maintenances.FindAsync(id);
            if (maintenance == null) return ServiceResult<bool>.AsNotFound();

            _context.Maintenances.Remove(maintenance);
            await _context.SaveChangesAsync();
            return ServiceResult<bool>.Ok(true);
        }
    }
}
