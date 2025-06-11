using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Auth.Shared.Services
{
    public interface IUserManager : IDomainService
    {
        Task ResetPasswordAsync(Guid userId, string newPassword, bool mustChangePassword = true);
        Task ChangePasswordAsync(Guid userId, string oldPassword, string newPassword);
        Task<string> GenerateRandomPassword(Guid userId);
        Task Unlock(Guid userId);
        Task AssignRoles(Guid userId, List<Guid> listOfRoleId);
    }
}
