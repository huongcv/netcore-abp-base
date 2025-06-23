namespace Ord.Plugin.Auth.Shared.Dtos.Auths
{
    public class LoginAsUserInputDto : EncodedIdDto
    {
        /// <summary>
        /// Thời gian tự động đăng xuất (phút). Mặc định 60 phút
        /// </summary>
        public int AutoLogoutMinutes { get; set; } = 60;
    }
}
