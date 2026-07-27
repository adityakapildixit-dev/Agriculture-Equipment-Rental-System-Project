namespace Agriculture_Equipment_Rental_System.Dto.Farmer
{
    public class FarmerResponseDto
    {
        public int FarmerId { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string MobileNo { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public string Village { get; set; } = string.Empty;

        public string State { get; set; } = string.Empty;

        public string AadhaarNo { get; set; } = string.Empty;

        public DateOnly RegistrationDate { get; set; }
    }
}