using System.ComponentModel.DataAnnotations;

namespace Ord.Plugin.Contract.Features.SystemSetting.Dto
{
    public class PasswordConfigDto
    {
        /// <summary>
        /// Độ dài tối thiểu của mật khẩu
        /// </summary>
        [Range(6, 50, ErrorMessage = "Độ dài mật khẩu phải từ 6 đến 50 ký tự")]
        public int PasswordMinLength { get; set; } = 8;

        /// <summary>
        /// Yêu cầu chữ hoa
        /// </summary>
        public bool RequireUppercase { get; set; } = true;

        /// <summary>
        /// Yêu cầu chữ thường
        /// </summary>
        public bool RequireLowercase { get; set; } = true;

        /// <summary>
        /// Yêu cầu số
        /// </summary>
        public bool RequireNumbers { get; set; } = true;

        /// <summary>
        /// Yêu cầu ký tự đặc biệt
        /// </summary>
        public bool RequireSpecialChars { get; set; } = false;

        /// <summary>
        /// Số ngày hết hạn mật khẩu (0 = không hết hạn)
        /// </summary>
        public int PasswordExpiry { get; set; } = 90;

        /// <summary>
        /// Số lần đăng nhập sai tối đa trước khi khóa tài khoản
        /// </summary>
        [Range(1, 100, ErrorMessage = "Số lần đăng nhập sai tối đa phải từ 1 đến 100")]
        public int MaxLoginAttempts { get; set; } = 5;
    }
}
