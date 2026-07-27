
using Agriculture_Equipment_Rental_System.Dto.Machinery;
namespace Agriculture_Equipment_Rental_System.Dto.Owner
{
    public class OwnerResponseDto

    {
        public int OwnerId { get; set; }
        public string OwnerName { get; set; }
        public string Phone { get; set; }
        public required string Email { get; set; }
        public string Address { get; set; }
        public string BankAccountNo { get; set; }
        public List<MachineryResponseDto> Machineries { get; set; } = new();
    }
}
