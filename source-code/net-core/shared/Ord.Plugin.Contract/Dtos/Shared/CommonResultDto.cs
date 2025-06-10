using FluentValidation.Results;
using Volo.Abp.Validation;

namespace Ord.Plugin.Contract.Dtos
{
    public class CommonResultDto<T>
    {
        /// <summary>
        /// 00: Success
        /// 400:bad request
        /// 500:error server - business
        /// </summary>
        [System.Text.Json.Serialization.JsonPropertyOrder(1)]
        public string? Code { get; set; }
        /// <summary>
        /// Thông báo lỗi/ hoặc thành công đều chung vào message
        /// </summary>
        [System.Text.Json.Serialization.JsonPropertyOrder(2)]
        public string? Message { get; set; }

        /// <summary>
        /// Kết quả chính của api
        /// </summary>
        [System.Text.Json.Serialization.JsonPropertyOrder(3)]
        public T Data { get; set; }
        /// <summary>
        /// Thông tin bổ sung, nếu cần thiết
        /// </summary>
        [System.Text.Json.Serialization.JsonPropertyOrder(100)]
        public object? Extend { get; set; }

        [Newtonsoft.Json.JsonIgnore]
        [System.Text.Json.Serialization.JsonIgnore]
        public bool IsSuccessful => string.Equals(CommonResultCode.Success, Code);

        public static CommonResultDto<T> Ok(T dataSuccess, string message = "")
        {
            var ret = new CommonResultDto<T>()
            {
                Code = CommonResultCode.Success,
                Data = dataSuccess,
                Message = message
            };
            return ret;
        }

        public static CommonResultDto<T> Failed(string errorMessage, string errorCode = "")
        {
            return new CommonResultDto<T>()
            {
                Message = errorMessage,
                Code = string.IsNullOrEmpty(errorCode) ? CommonResultCode.BadRequest : errorCode
            };
        }
        public static CommonResultDto<T> Failed(Exception ex)
        {
            return new CommonResultDto<T>()
            {
                Code = CommonResultCode.InternalServerError,
                Message = ""
            };
        }
        public static CommonResultDto<T> ValidationFailure(List<ValidationFailure> errorValid)
        {
            return new CommonResultDto<T>()
            {
                Code = CommonResultCode.BadRequest,
                Message = errorValid?.FirstOrDefault()?.ErrorMessage,
                Extend = errorValid
            };
        }
        public static CommonResultDto<T> ValidationFailure(AbpValidationException invalidEx)
        {
            if (invalidEx?.ValidationErrors?.Any() == true)
            {
                return new CommonResultDto<T>()
                {
                    Code = CommonResultCode.BadRequest,
                    Message = invalidEx?.ValidationErrors?.FirstOrDefault()?.ErrorMessage,
                    Extend = invalidEx?.ValidationErrors
                };
            }
            return new CommonResultDto<T>()
            {
                Code = CommonResultCode.BadRequest,
                Message = invalidEx?.Message
            };
        }
        public static CommonResultDto<T> ValidationFailure(string message) => new()
        {
            Code = CommonResultCode.BadRequest,
            Message = message
        };

        /// <summary>
        /// Tạo kết quả với trạng thái Unauthorized (401)
        /// </summary>
        /// <param name="message">Thông báo lỗi không có quyền</param>
        /// <returns>CommonResultDto với trạng thái Unauthorized</returns>
        public static CommonResultDto<T> Unauthorized(string message = "")
        {
            return new CommonResultDto<T>
            {
                Code = CommonResultCode.Unauthorized,
                Message = string.IsNullOrWhiteSpace(message) ? "Unauthorized access" : message,
            };
        }
        /// <summary>
        /// Tạo kết quả với trạng thái Forbidden (403)
        /// </summary>
        /// <param name="message">Thông báo lỗi bị cấm truy cập</param>
        /// <returns>CommonResultDto với trạng thái Forbidden</returns>
        public static CommonResultDto<T> Forbidden(string message = "")
        {
            return new CommonResultDto<T>
            {
                Code = CommonResultCode.Forbidden,
                Message = string.IsNullOrWhiteSpace(message) ? "Access forbidden" : message
            };
        }
    }
}
