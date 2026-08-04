
using Agriculture_Equipment_Rental_System.Dto.Machinery;
namespace Agriculture_Equipment_Rental_System.Dto.Owner
{
    public class OwnerResponseDto

    {
        public int OwnerId { get; set; }
        public required string OwnerName { get; set; }
        public required string Phone { get; set; }
        public required string Email { get; set; }
        public required string Address { get; set; }
        public required string BankAccountNo { get; set; }
        public List<MachineryResponseDto> Machineries { get; set; } = new();
    }
}
