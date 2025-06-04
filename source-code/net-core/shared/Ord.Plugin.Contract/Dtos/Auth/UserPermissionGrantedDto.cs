namespace Ord.Plugin.Contract.Dtos.Auth
{
    public class UserPermissionGrantedDto
    {
        public Guid UserId { get; set; }
        public string? PermissionName { get; set; }
        public bool IsGrant { get; set; }
    }
}
