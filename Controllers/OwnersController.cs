using Agriculture_Equipment_Rental_System.Dto.Owner;
using Agriculture_Equipment_Rental_System.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Agriculture_Equipment_Rental_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OwnersController : ControllerBase
    {
        private readonly IOwnerService _ownerService;

        public OwnersController(IOwnerService ownerService)
        {
            _ownerService = ownerService;
        }

        // POST: api/owners
        [HttpPost]
        public async Task<ActionResult<OwnerResponseDto>> CreateOwner(OwnerCreateDto dto)
        {
            var result = await _ownerService.CreateOwnerAsync(dto);
            return CreatedAtAction(nameof(GetOwner), new { id = result.OwnerId }, result);
        }

        // GET: api/owners/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OwnerResponseDto>> GetOwner(int id)
        {
            var owner = await _ownerService.GetOwnerAsync(id);
            if (owner == null) return NotFound();
            return owner;
        }

        // GET: api/owners
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OwnerResponseDto>>> GetAllOwners()
        {
            return await _ownerService.GetAllOwnersAsync();
        }

        // PUT: api/owners/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOwner(int id, OwnerCreateDto dto)
        {
            var result = await _ownerService.UpdateOwnerAsync(id, dto);
            if (result.NotFound) return NotFound();
            return NoContent();
        }

        // DELETE: api/owners/5
        // Only Admins are allowed to delete an owner record
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteOwner(int id)
        {
            var result = await _ownerService.DeleteOwnerAsync(id);
            if (result.NotFound) return NotFound();
            return NoContent();
        }
    }
}
