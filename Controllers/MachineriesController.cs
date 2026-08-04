using Agriculture_Equipment_Rental_System.Dto.Machinery;
using Agriculture_Equipment_Rental_System.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Agriculture_Equipment_Rental_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MachineryController : ControllerBase
    {
        private readonly IMachineryService _machineryService;

        public MachineryController(IMachineryService machineryService)
        {
            _machineryService = machineryService;
        }

        // POST: api/machinery
        [HttpPost]
        public async Task<ActionResult<MachineryResponseDto>> CreateMachinery(MachineryCreateDto dto)
        {
            var result = await _machineryService.CreateMachineryAsync(dto);
            if (!result.Success) return BadRequest(result.ErrorMessage);
            return CreatedAtAction(nameof(GetMachinery), new { id = result.Data!.MachineryId }, result.Data);
        }

        // GET: api/machinery/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MachineryResponseDto>> GetMachinery(int id)
        {
            var machinery = await _machineryService.GetMachineryAsync(id);
            if (machinery == null) return NotFound();
            return machinery;
        }

        // GET: api/machinery
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MachineryResponseDto>>> GetAllMachinery()
        {
            return await _machineryService.GetAllMachineryAsync();
        }

        // PUT: api/machinery/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMachinery(int id, MachineryCreateDto dto)
        {
            var result = await _machineryService.UpdateMachineryAsync(id, dto);
            if (result.NotFound) return NotFound();
            return NoContent();
        }

        // DELETE: api/machinery/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMachinery(int id)
        {
            var result = await _machineryService.DeleteMachineryAsync(id);
            if (result.NotFound) return NotFound();
            return NoContent();
        }
    }
}
