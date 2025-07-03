using Ord.Plugin.Contract.Features.Validation.Attributes;

namespace Ord.Plugin.Contract.Features.SystemSetting.Dto
{
    public class SmtpMailingDto
    {
        public const string PrefixName = "System:Mailing.Smtp";
        /// <summary>
        /// SMTP Host (ví dụ: smtp.gmail.com)
        /// </summary>
        [OrdValidateRequired]
        public string? Host { get; set; }

        /// <summary>
        /// SMTP Port (ví dụ: 587, 465, 25)
        /// </summary>
        [OrdValidateRequired]
        public int Port { get; set; } = 587;

        /// <summary>
        /// Username để đăng nhập SMTP
        /// </summary>
        [OrdValidateRequired]
        [OrdMaxLengthString(300)]
        [OrdValidEmail]
        public string? Username { get; set; }

        public string? Password { get; set; }

        /// <summary>
        /// Tên người gửi hiển thị
        /// </summary>
        [OrdValidateRequired]
        [OrdMaxLengthString(200)]
        public string? DisplayName { get; set; }
        /// <summary>
        /// Bật/tắt SSL
        /// </summary>
        public bool EnableSsl { get; set; } = true;
    }
}
