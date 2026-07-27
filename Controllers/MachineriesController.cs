using Agriculture_Equipment_Rental_System.Data;
using Agriculture_Equipment_Rental_System.Dto.Machinery;
using Agriculture_Equipment_Rental_System.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Agriculture_Equipment_Rental_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MachineryController : ControllerBase
    {
        private readonly AgriMachineryDbContext _context;

        public MachineryController(AgriMachineryDbContext context)
        {
            _context = context;
        }

        // POST: api/machinery
        [HttpPost]
        public async Task<ActionResult<MachineryResponseDto>> CreateMachinery(MachineryCreateDto dto)
        {
            var ownerExists = await _context.Owners.AnyAsync(o => o.OwnerId == dto.OwnerId);
            if (!ownerExists) return BadRequest("Owner not found.");

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

            var result = new MachineryResponseDto
            {
                MachineryId = machinery.MachineryId,
                OwnerId = machinery.OwnerId,
                MachineName = machinery.MachineName,
                Brand = machinery.Brand,
                DailyRate = machinery.DailyRate,
                AvailabilityStatus = machinery.AvailabilityStatus,
                Description = machinery.Description
            };

            return CreatedAtAction(nameof(GetMachinery), new { id = machinery.MachineryId }, result);
        }

        // GET: api/machinery/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MachineryResponseDto>> GetMachinery(int id)
        {
            var machinery = await _context.Machineries.FindAsync(id);
            if (machinery == null) return NotFound();

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

        // GET: api/machinery
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MachineryResponseDto>>> GetAllMachinery()
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

        // PUT: api/machinery/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMachinery(int id, MachineryCreateDto dto)
        {
            var machinery = await _context.Machineries.FindAsync(id);
            if (machinery == null) return NotFound();

            machinery.MachineName = dto.MachineName;
            machinery.Brand = dto.Brand;
            machinery.DailyRate = dto.DailyRate;
            machinery.AvailabilityStatus = dto.AvailabilityStatus;
            machinery.Description = dto.Description;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/machinery/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMachinery(int id)
        {
            var machinery = await _context.Machineries.FindAsync(id);
            if (machinery == null) return NotFound();

            _context.Machineries.Remove(machinery);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}