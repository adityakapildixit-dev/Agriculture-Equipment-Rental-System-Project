using Agriculture_Equipment_Rental_System.Data;
using Agriculture_Equipment_Rental_System.Dto.Machinery;
using Agriculture_Equipment_Rental_System.Dto.Owner;
using Agriculture_Equipment_Rental_System.Models;
using Agriculture_Equipment_Rental_System.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Agriculture_Equipment_Rental_System.Services
{
    public class OwnerService : IOwnerService
    {
        private readonly AgriMachineryDbContext _context;

        public OwnerService(AgriMachineryDbContext context)
        {
            _context = context;
        }

        private static OwnerResponseDto ToDto(Owner owner)
        {
            return new OwnerResponseDto
            {
                OwnerId = owner.OwnerId,
                OwnerName = owner.OwnerName,
                Phone = owner.Phone,
                Email = owner.Email,
                Address = owner.Address,
                BankAccountNo = owner.BankAccountNo,
                Machineries = owner.Machineries == null
                    ? new List<MachineryResponseDto>()
                    : owner.Machineries.Select(m => new MachineryResponseDto
                    {
                        MachineryId = m.MachineryId,
                        OwnerId = m.OwnerId,
                        MachineName = m.MachineName,
                        Brand = m.Brand,
                        DailyRate = m.DailyRate,
                        AvailabilityStatus = m.AvailabilityStatus,
                        Description = m.Description
                    }).ToList()
            };
        }

        public async Task<OwnerResponseDto> CreateOwnerAsync(OwnerCreateDto dto)
        {
            var owner = new Owner
            {
                OwnerName = dto.OwnerName,
                Phone = dto.Phone,
                Email = dto.Email,
                Address = dto.Address,
                BankAccountNo = dto.BankAccountNo
            };

            _context.Owners.Add(owner);
            await _context.SaveChangesAsync();

            return new OwnerResponseDto
            {
                OwnerId = owner.OwnerId,
                OwnerName = owner.OwnerName,
                Phone = owner.Phone,
                Email = owner.Email,
                Address = owner.Address,
                BankAccountNo = owner.BankAccountNo,
                Machineries = new List<MachineryResponseDto>()
            };
        }

        public async Task<OwnerResponseDto?> GetOwnerAsync(int id)
        {
            var owner = await _context.Owners
                .Include(o => o.Machineries)
                .FirstOrDefaultAsync(o => o.OwnerId == id);

            return owner == null ? null : ToDto(owner);
        }

        public async Task<List<OwnerResponseDto>> GetAllOwnersAsync()
        {
            var owners = await _context.Owners
                .Include(o => o.Machineries)
                .ToListAsync();

            return owners.Select(ToDto).ToList();
        }

        public async Task<ServiceResult<bool>> UpdateOwnerAsync(int id, OwnerCreateDto dto)
        {
            var owner = await _context.Owners.FindAsync(id);
            if (owner == null) return ServiceResult<bool>.AsNotFound();

            owner.OwnerName = dto.OwnerName;
            owner.Phone = dto.Phone;
            owner.Email = dto.Email;
            owner.Address = dto.Address;
            owner.BankAccountNo = dto.BankAccountNo;

            await _context.SaveChangesAsync();
            return ServiceResult<bool>.Ok(true);
        }

        public async Task<ServiceResult<bool>> DeleteOwnerAsync(int id)
        {
            var owner = await _context.Owners.FindAsync(id);
            if (owner == null) return ServiceResult<bool>.AsNotFound();

            _context.Owners.Remove(owner);
            await _context.SaveChangesAsync();
            return ServiceResult<bool>.Ok(true);
        }
    }
}
