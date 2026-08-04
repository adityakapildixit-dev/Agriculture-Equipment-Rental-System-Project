using Agriculture_Equipment_Rental_System.Dto.Farmer;
using Agriculture_Equipment_Rental_System.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Agriculture_Equipment_Rental_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FarmersController : ControllerBase
    {
        private readonly IFarmerService _farmerService;

        public FarmersController(IFarmerService farmerService)
        {
            _farmerService = farmerService;
        }

        // POST: api/Farmer
        [HttpPost]
        public async Task<ActionResult<FarmerResponseDto>> CreateFarmer(FarmerCreateDto dto)
        {
            var result = await _farmerService.CreateFarmerAsync(dto);
            return CreatedAtAction(nameof(GetFarmer), new { id = result.FarmerId }, result);
        }

        // GET: api/Farmer/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FarmerResponseDto>> GetFarmer(int id)
        {
            var farmer = await _farmerService.GetFarmerAsync(id);
            if (farmer == null) return NotFound();
            return farmer;
        }

        // GET: api/Farmer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FarmerResponseDto>>> GetAllFarmers()
        {
            return await _farmerService.GetAllFarmersAsync();
        }

        // PUT: api/Farmer/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFarmer(int id, FarmerCreateDto dto)
        {
            var result = await _farmerService.UpdateFarmerAsync(id, dto);
            if (result.NotFound) return NotFound();
            if (!result.Success) return BadRequest(result.ErrorMessage);
            return NoContent();
        }

        // DELETE: api/Farmer/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFarmer(int id)
        {
            var result = await _farmerService.DeleteFarmerAsync(id);
            if (result.NotFound) return NotFound();
            return NoContent();
        }
    }
}
