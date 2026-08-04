using Agriculture_Equipment_Rental_System.Data;
using Agriculture_Equipment_Rental_System.Models;
using Agriculture_Equipment_Rental_System.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Agriculture_Equipment_Rental_System.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly AgriMachineryDbContext _context;

        public PaymentService(AgriMachineryDbContext context)
        {
            _context = context;
        }

        public async Task<List<Payment>> GetAllPaymentsAsync()
        {
            return await _context.Payments.ToListAsync();
        }

        public async Task<Payment?> GetPaymentAsync(int paymentId)
        {
            return await _context.Payments.FindAsync(paymentId);
        }

        public async Task<ServiceResult<bool>> UpdatePaymentAsync(int? paymentId, Payment payment)
        {
            if (paymentId != payment.PaymentId) return ServiceResult<bool>.Fail("Id mismatch.");

            _context.Entry(payment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                var stillExists = await _context.Payments.AnyAsync(p => p.PaymentId == paymentId);
                if (!stillExists) return ServiceResult<bool>.AsNotFound();
                throw;
            }

            return ServiceResult<bool>.Ok(true);
        }

        public async Task<Payment> CreatePaymentAsync(Payment payment)
        {
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            return payment;
        }

        public async Task<ServiceResult<bool>> DeletePaymentAsync(int? paymentId)
        {
            var payment = await _context.Payments.FindAsync(paymentId);
            if (payment == null) return ServiceResult<bool>.AsNotFound();

            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();
            return ServiceResult<bool>.Ok(true);
        }
    }
}
