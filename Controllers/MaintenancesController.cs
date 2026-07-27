using Agriculture_Equipment_Rental_System.Data;
using Agriculture_Equipment_Rental_System.Dto.Maintenance;
using Agriculture_Equipment_Rental_System.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Agriculture_Equipment_Rental_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaintenancesController : ControllerBase
    {
        private readonly AgriMachineryDbContext _context;

        public MaintenancesController(AgriMachineryDbContext context)
        {
            _context = context;
        }

        // POST: api/Maintenance
        [HttpPost]
        public async Task<ActionResult<MaintenanceResponseDto>> CreateMaintenance(MaintenanceCreateDto dto)
        {
            var machineryExists = await _context.Machineries.AnyAsync(m => m.MachineryId == dto.MachineryId);
            if (!machineryExists) return BadRequest("Machinery not found.");

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

            if (createdMaintenance == null) return NotFound();

            var result = new MaintenanceResponseDto
            {
                MaintenanceId = createdMaintenance.MaintenanceId,
                MachineryId = createdMaintenance.MachineryId,
                MachineryName = createdMaintenance.Machinery.MachineName,
                MaintenanceDate = createdMaintenance.MaintenanceDate,
                IssueDescription = createdMaintenance.IssueDescription,
                Cost = createdMaintenance.Cost,
                NextServiceDate = createdMaintenance.NextServiceDate,
                Status = createdMaintenance.Status
            };

            return CreatedAtAction(nameof(GetMaintenance), new { id = maintenance.MaintenanceId }, result);
        }

        // GET: api/Maintenance/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MaintenanceResponseDto>> GetMaintenance(int id)
        {
            var maintenance = await _context.Maintenances
                .Include(m => m.Machinery)
                .FirstOrDefaultAsync(m => m.MaintenanceId == id);

            if (maintenance == null) return NotFound();

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

        // GET: api/Maintenance
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MaintenanceResponseDto>>> GetAllMaintenances()
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

        // PUT: api/Maintenance/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMaintenance(int id, MaintenanceCreateDto dto)
        {
            var maintenance = await _context.Maintenances.FindAsync(id);
            if (maintenance == null) return NotFound();

            var machineryExists = await _context.Machineries.AnyAsync(m => m.MachineryId == dto.MachineryId);
            if (!machineryExists) return BadRequest("Machinery not found.");

            maintenance.MachineryId = dto.MachineryId;
            maintenance.MaintenanceDate = dto.MaintenanceDate;
            maintenance.IssueDescription = dto.IssueDescription;
            maintenance.Cost = dto.Cost;
            maintenance.NextServiceDate = dto.NextServiceDate;
            maintenance.Status = dto.Status;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Maintenance/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMaintenance(int id)
        {
            var maintenance = await _context.Maintenances.FindAsync(id);
            if (maintenance == null) return NotFound();

            _context.Maintenances.Remove(maintenance);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}