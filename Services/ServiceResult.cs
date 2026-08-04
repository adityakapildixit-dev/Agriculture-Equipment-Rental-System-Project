namespace Agriculture_Equipment_Rental_System.Services
{
    // A small, generic wrapper that every service method returns.
    // Instead of the service deciding HTTP responses (that's the controller's job),
    // it just says: did it work? was something not found? was there a validation error?
    public class ServiceResult<T>
    {
        public bool Success { get; set; }
        public bool NotFound { get; set; }
        public string? ErrorMessage { get; set; }
        public T? Data { get; set; }

        public static ServiceResult<T> Ok(T data)
        {
            return new ServiceResult<T> { Success = true, Data = data };
        }

        public static ServiceResult<T> Fail(string errorMessage)
        {
            return new ServiceResult<T> { Success = false, ErrorMessage = errorMessage };
        }

        public static ServiceResult<T> AsNotFound()
        {
            return new ServiceResult<T> { Success = false, NotFound = true };
        }
    }
}
