using Agriculture_Equipment_Rental_System.Data;
using Agriculture_Equipment_Rental_System.Dto.Farmer;
using Agriculture_Equipment_Rental_System.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Agriculture_Equipment_Rental_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FarmersController : ControllerBase
    {
        private readonly AgriMachineryDbContext _context;

        public FarmersController(AgriMachineryDbContext context)
        {
            _context = context;
        }

        // POST: api/Farmer
        [HttpPost]
        public async Task<ActionResult<FarmerResponseDto>> CreateFarmer(FarmerCreateDto dto)
        {
            var farmer = new Farmer
            {
                FullName = dto.FullName,
                MobileNo = dto.MobileNo,
                Email = dto.Email,
                Address = dto.Address,
                Village = dto.Village,
                State = dto.State,
                AadhaarNo = dto.AadhaarNo,
                RegistrationDate = dto.RegistrationDate
            };

            _context.Farmers.Add(farmer);
            await _context.SaveChangesAsync();

            var result = new FarmerResponseDto
            {
                FarmerId = farmer.FarmerId,
                FullName = farmer.FullName,
                MobileNo = farmer.MobileNo,
                Email = farmer.Email,
                Address = farmer.Address,
                Village = farmer.Village,
                State = farmer.State,
                AadhaarNo = farmer.AadhaarNo,
                RegistrationDate = farmer.RegistrationDate
            };

            return CreatedAtAction(nameof(GetFarmer), new { id = farmer.FarmerId }, result);
        }

        // GET: api/Farmer/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FarmerResponseDto>> GetFarmer(int id)
        {
            var farmer = await _context.Farmers.FindAsync(id);
            if (farmer == null) return NotFound();

            return new FarmerResponseDto
            {
                FarmerId = farmer.FarmerId,
                FullName = farmer.FullName,
                MobileNo = farmer.MobileNo,
                Email = farmer.Email,
                Address = farmer.Address,
                Village = farmer.Village,
                State = farmer.State,
                AadhaarNo = farmer.AadhaarNo,
                RegistrationDate = farmer.RegistrationDate
            };
        }

        // GET: api/Farmer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FarmerResponseDto>>> GetAllFarmers()
        {
            return await _context.Farmers
                .Select(farmer => new FarmerResponseDto
                {
                    FarmerId = farmer.FarmerId,
                    FullName = farmer.FullName,
                    MobileNo = farmer.MobileNo,
                    Email = farmer.Email,
                    Address = farmer.Address,
                    Village = farmer.Village,
                    State = farmer.State,
                    AadhaarNo = farmer.AadhaarNo,
                    RegistrationDate = farmer.RegistrationDate
                })
                .ToListAsync();
        }

        // PUT: api/Farmer/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFarmer(int id, FarmerCreateDto dto)
        {
            var farmer = await _context.Farmers.FindAsync(id);
            if (farmer == null) return NotFound();

            farmer.FullName = dto.FullName;
            farmer.MobileNo = dto.MobileNo;
            farmer.Email = dto.Email;
            farmer.Address = dto.Address;
            farmer.Village = dto.Village;
            farmer.State = dto.State;
            farmer.AadhaarNo = dto.AadhaarNo;
            farmer.RegistrationDate = dto.RegistrationDate;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Farmer/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFarmer(int id)
        {
            var farmer = await _context.Farmers.FindAsync(id);
            if (farmer == null) return NotFound();

            _context.Farmers.Remove(farmer);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}