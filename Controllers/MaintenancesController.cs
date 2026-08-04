using Agriculture_Equipment_Rental_System.Dto.Maintenance;
using Agriculture_Equipment_Rental_System.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Agriculture_Equipment_Rental_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MaintenancesController : ControllerBase
    {
        private readonly IMaintenanceService _maintenanceService;

        public MaintenancesController(IMaintenanceService maintenanceService)
        {
            _maintenanceService = maintenanceService;
        }

        // POST: api/Maintenance
        [HttpPost]
        public async Task<ActionResult<MaintenanceResponseDto>> CreateMaintenance(MaintenanceCreateDto dto)
        {
            var result = await _maintenanceService.CreateMaintenanceAsync(dto);
            if (!result.Success) return BadRequest(result.ErrorMessage);
            return CreatedAtAction(nameof(GetMaintenance), new { id = result.Data!.MaintenanceId }, result.Data);
        }

        // GET: api/Maintenance/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MaintenanceResponseDto>> GetMaintenance(int id)
        {
            var maintenance = await _maintenanceService.GetMaintenanceAsync(id);
            if (maintenance == null) return NotFound();
            return maintenance;
        }

        // GET: api/Maintenance
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MaintenanceResponseDto>>> GetAllMaintenances()
        {
            return await _maintenanceService.GetAllMaintenancesAsync();
        }

        // PUT: api/Maintenance/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMaintenance(int id, MaintenanceCreateDto dto)
        {
            var result = await _maintenanceService.UpdateMaintenanceAsync(id, dto);
            if (result.NotFound) return NotFound();
            if (!result.Success) return BadRequest(result.ErrorMessage);
            return NoContent();
        }

        // DELETE: api/Maintenance/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMaintenance(int id)
        {
            var result = await _maintenanceService.DeleteMaintenanceAsync(id);
            if (result.NotFound) return NotFound();
            return NoContent();
        }
    }
}
