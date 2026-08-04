using Agriculture_Equipment_Rental_System.Data;
using Agriculture_Equipment_Rental_System.Dto.Invoice;
using Agriculture_Equipment_Rental_System.Models;
using Agriculture_Equipment_Rental_System.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Agriculture_Equipment_Rental_System.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly AgriMachineryDbContext _context;

        public InvoiceService(AgriMachineryDbContext context)
        {
            _context = context;
        }

        private static InvoiceResponseDto ToDto(Invoice invoice)
        {
            return new InvoiceResponseDto
            {
                InvoiceId = invoice.InvoiceId,
                BookingId = invoice.BookingId,
                InvoiceDate = invoice.InvoiceDate,
                TotalAmount = invoice.TotalAmount,
                Gst = invoice.Gst,
                Discount = invoice.Discount,
                FinalAmount = invoice.FinalAmount
            };
        }

        public async Task<ServiceResult<InvoiceResponseDto>> CreateInvoiceAsync(InvoiceCreateDto dto)
        {
            var bookingExists = await _context.Bookings.AnyAsync(b => b.BookingId == dto.BookingId);
            if (!bookingExists) return ServiceResult<InvoiceResponseDto>.Fail("Booking not found.");

            var invoice = new Invoice
            {
                BookingId = dto.BookingId,
                InvoiceDate = dto.InvoiceDate,
                TotalAmount = dto.TotalAmount,
                Gst = dto.Gst,
                Discount = dto.Discount,
                FinalAmount = dto.FinalAmount
            };

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            return ServiceResult<InvoiceResponseDto>.Ok(ToDto(invoice));
        }

        public async Task<InvoiceResponseDto?> GetInvoiceAsync(int id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            return invoice == null ? null : ToDto(invoice);
        }

        public async Task<List<InvoiceResponseDto>> GetAllInvoicesAsync()
        {
            return await _context.Invoices
                .Select(invoice => new InvoiceResponseDto
                {
                    InvoiceId = invoice.InvoiceId,
                    BookingId = invoice.BookingId,
                    InvoiceDate = invoice.InvoiceDate,
                    TotalAmount = invoice.TotalAmount,
                    Gst = invoice.Gst,
                    Discount = invoice.Discount,
                    FinalAmount = invoice.FinalAmount
                })
                .ToListAsync();
        }

        public async Task<ServiceResult<bool>> UpdateInvoiceAsync(int id, InvoiceCreateDto dto)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null) return ServiceResult<bool>.AsNotFound();

            var bookingExists = await _context.Bookings.AnyAsync(b => b.BookingId == dto.BookingId);
            if (!bookingExists) return ServiceResult<bool>.Fail("Booking not found.");

            invoice.BookingId = dto.BookingId;
            invoice.InvoiceDate = dto.InvoiceDate;
            invoice.TotalAmount = dto.TotalAmount;
            invoice.Gst = dto.Gst;
            invoice.Discount = dto.Discount;
            invoice.FinalAmount = dto.FinalAmount;

            await _context.SaveChangesAsync();
            return ServiceResult<bool>.Ok(true);
        }

        public async Task<ServiceResult<bool>> DeleteInvoiceAsync(int id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null) return ServiceResult<bool>.AsNotFound();

            _context.Invoices.Remove(invoice);
            await _context.SaveChangesAsync();
            return ServiceResult<bool>.Ok(true);
        }
    }
}
