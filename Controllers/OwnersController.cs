using Agriculture_Equipment_Rental_System.Data;
using Agriculture_Equipment_Rental_System.Dto.Machinery;
using Agriculture_Equipment_Rental_System.Dto.Owner;
using Agriculture_Equipment_Rental_System.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Agriculture_Equipment_Rental_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OwnersController : ControllerBase
    {
        private readonly AgriMachineryDbContext _context; 

        public OwnersController(AgriMachineryDbContext context)
        {
            _context = context;
        }

        // POST: api/owners
        [HttpPost]
        public async Task<ActionResult<OwnerResponseDto>> CreateOwner(OwnerCreateDto dto)
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

            var result = new OwnerResponseDto
            {
                OwnerId = owner.OwnerId,
                OwnerName = owner.OwnerName,
                Phone = owner.Phone,
                Email = owner.Email,
                Address = owner.Address,
                BankAccountNo = owner.BankAccountNo,
                Machineries = new List<MachineryResponseDto>()
            };

            return CreatedAtAction(nameof(GetOwner), new { id = owner.OwnerId }, result);
        }

        // GET: api/owners/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OwnerResponseDto>> GetOwner(int id)
        {
            var owner = await _context.Owners
                .Include(o => o.Machineries)
                .FirstOrDefaultAsync(o => o.OwnerId == id);

            if (owner == null) return NotFound();

            return new OwnerResponseDto
            {
                OwnerId = owner.OwnerId,
                OwnerName = owner.OwnerName,
                Phone = owner.Phone,
                Email = owner.Email,
                Address = owner.Address,
                BankAccountNo = owner.BankAccountNo,
                Machineries = owner.Machineries.Select(m => new MachineryResponseDto
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

        // GET: api/owners
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OwnerResponseDto>>> GetAllOwners()
        {
            var owners = await _context.Owners
                .Include(o => o.Machineries)
                .ToListAsync();

            return owners.Select(owner => new OwnerResponseDto
            {
                OwnerId = owner.OwnerId,
                OwnerName = owner.OwnerName,
                Phone = owner.Phone,
                Email = owner.Email,
                Address = owner.Address,
                BankAccountNo = owner.BankAccountNo,
                Machineries = owner.Machineries.Select(m => new MachineryResponseDto
                {
                    MachineryId = m.MachineryId,
                    OwnerId = m.OwnerId,
                    MachineName = m.MachineName,
                    Brand = m.Brand,
                    DailyRate = m.DailyRate,
                    AvailabilityStatus = m.AvailabilityStatus,
                    Description = m.Description
                }).ToList()
            }).ToList();
        }

        // PUT: api/owners/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOwner(int id, OwnerCreateDto dto)
        {
            var owner = await _context.Owners.FindAsync(id);
            if (owner == null) return NotFound();

            owner.OwnerName = dto.OwnerName;
            owner.Phone = dto.Phone;
            owner.Email = dto.Email;
            owner.Address = dto.Address;
            owner.BankAccountNo = dto.BankAccountNo;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/owners/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOwner(int id)
        {
            var owner = await _context.Owners.FindAsync(id);
            if (owner == null) return NotFound();

            _context.Owners.Remove(owner);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}