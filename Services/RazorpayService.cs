using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Agriculture_Equipment_Rental_System.Data;
using Agriculture_Equipment_Rental_System.Dto.Invoice;
using Agriculture_Equipment_Rental_System.Dto.Payment;
using Agriculture_Equipment_Rental_System.Models;
using Agriculture_Equipment_Rental_System.Services.Interfaces;

namespace Agriculture_Equipment_Rental_System.Services
{
    // Talks to Razorpay's REST API directly over HttpClient (no extra NuGet
    // package needed) to create an order, then verifies the payment
    // signature Razorpay Checkout hands back before creating a Payment +
    // Invoice for the booking.
    //
    // This is a brand new file -- IBookingService, IPaymentService and
    // IInvoiceService are used exactly as they already were; none of them
    // were changed to make this work.
    public class RazorpayService : IRazorpayService
    {
        // 18% GST is assumed for the generated invoice. Change this if your
        // invoices should use a different rate.
        private const decimal GstRate = 0.18m;

        private readonly AgriMachineryDbContext _context;
        private readonly IBookingService _bookingService;
        private readonly IPaymentService _paymentService;
        private readonly IInvoiceService _invoiceService;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public RazorpayService(
            AgriMachineryDbContext context,
            IBookingService bookingService,
            IPaymentService paymentService,
            IInvoiceService invoiceService,
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration)
        {
            _context = context;
            _bookingService = bookingService;
            _paymentService = paymentService;
            _invoiceService = invoiceService;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        public async Task<ServiceResult<RazorpayOrderResponseDto>> CreateOrderAsync(RazorpayOrderRequestDto dto)
        {
            var booking = await _bookingService.GetBookingAsync(dto.BookingId);
            if (booking == null)
                return ServiceResult<RazorpayOrderResponseDto>.Fail("Booking not found.");

            var keyId = _configuration["Razorpay:KeyId"];
            var keySecret = _configuration["Razorpay:KeySecret"];
            if (string.IsNullOrWhiteSpace(keyId) || string.IsNullOrWhiteSpace(keySecret))
                return ServiceResult<RazorpayOrderResponseDto>.Fail(
                    "Razorpay is not configured on the server. Add Razorpay:KeyId and Razorpay:KeySecret to appsettings.json.");

            // Razorpay expects the amount in paise (smallest currency unit).
            var amountInPaise = (int)Math.Round(booking.TotalAmount * 100, MidpointRounding.AwayFromZero);

            var client = _httpClientFactory.CreateClient();
            client.BaseAddress = new Uri("https://api.razorpay.com/v1/");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                "Basic", Convert.ToBase64String(Encoding.UTF8.GetBytes($"{keyId}:{keySecret}")));

            var payload = new
            {
                amount = amountInPaise,
                currency = "INR",
                receipt = $"booking_{booking.BookingId}",
                payment_capture = 1
            };

            HttpResponseMessage response;
            try
            {
                response = await client.PostAsJsonAsync("orders", payload);
            }
            catch (HttpRequestException ex)
            {
                return ServiceResult<RazorpayOrderResponseDto>.Fail($"Could not reach Razorpay: {ex.Message}");
            }

            var body = await response.Content.ReadAsStringAsync();
            if (!response.IsSuccessStatusCode)
                return ServiceResult<RazorpayOrderResponseDto>.Fail($"Razorpay order creation failed: {body}");

            using var json = JsonDocument.Parse(body);
            var orderId = json.RootElement.GetProperty("id").GetString()!;

            return ServiceResult<RazorpayOrderResponseDto>.Ok(new RazorpayOrderResponseDto
            {
                OrderId = orderId,
                AmountInPaise = amountInPaise,
                Currency = "INR",
                KeyId = keyId,
                BookingId = booking.BookingId
            });
        }

        public async Task<ServiceResult<RazorpayVerifyResponseDto>> VerifyAndCompleteAsync(RazorpayVerifyDto dto)
        {
            var keySecret = _configuration["Razorpay:KeySecret"];
            if (string.IsNullOrWhiteSpace(keySecret))
                return ServiceResult<RazorpayVerifyResponseDto>.Fail("Razorpay is not configured on the server.");

            var expectedSignature = ComputeSignature(dto.RazorpayOrderId, dto.RazorpayPaymentId, keySecret);
            var signatureIsValid = CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(expectedSignature),
                Encoding.UTF8.GetBytes(dto.RazorpaySignature));

            if (!signatureIsValid)
                return ServiceResult<RazorpayVerifyResponseDto>.Fail("Payment verification failed: signature mismatch.");

            var booking = await _bookingService.GetBookingAsync(dto.BookingId);
            if (booking == null)
                return ServiceResult<RazorpayVerifyResponseDto>.Fail("Booking not found.");

            // 1. Record the payment -- reuses the existing Payments table/model exactly as-is.
            var payment = await _paymentService.CreatePaymentAsync(new Payment
            {
                BookingId = booking.BookingId,
                PaymentDate = DateOnly.FromDateTime(DateTime.UtcNow),
                Amount = booking.TotalAmount,
                PaymentMethod = "Razorpay",
                PaymentStatus = "Paid",
                TransactionId = dto.RazorpayPaymentId
            });

            // 2. Generate the invoice -- reuses the existing Invoices table/model exactly as-is.
            var gst = Math.Round(booking.TotalAmount * GstRate, 2);
            var discount = 0m;
            var finalAmount = booking.TotalAmount + gst - discount;

            var invoiceResult = await _invoiceService.CreateInvoiceAsync(new InvoiceCreateDto
            {
                BookingId = booking.BookingId,
                InvoiceDate = DateOnly.FromDateTime(DateTime.UtcNow),
                TotalAmount = booking.TotalAmount,
                Gst = gst,
                Discount = discount,
                FinalAmount = finalAmount
            });

            if (!invoiceResult.Success || invoiceResult.Data == null)
                return ServiceResult<RazorpayVerifyResponseDto>.Fail(
                    invoiceResult.ErrorMessage ?? "Could not generate the invoice.");

            // 3. Mark the booking confirmed now that it has been paid for.
            var bookingEntity = await _context.Bookings.FindAsync(booking.BookingId);
            if (bookingEntity != null)
            {
                bookingEntity.BookingStatus = "Confirmed";
                await _context.SaveChangesAsync();
            }

            return ServiceResult<RazorpayVerifyResponseDto>.Ok(new RazorpayVerifyResponseDto
            {
                PaymentId = payment.PaymentId,
                PaymentStatus = payment.PaymentStatus,
                InvoiceId = invoiceResult.Data.InvoiceId,
                TotalAmount = invoiceResult.Data.TotalAmount,
                Gst = invoiceResult.Data.Gst,
                Discount = invoiceResult.Data.Discount,
                FinalAmount = invoiceResult.Data.FinalAmount
            });
        }

        private static string ComputeSignature(string orderId, string paymentId, string keySecret)
        {
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(keySecret));
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes($"{orderId}|{paymentId}"));
            return Convert.ToHexString(hash).ToLowerInvariant();
        }
    }
}
