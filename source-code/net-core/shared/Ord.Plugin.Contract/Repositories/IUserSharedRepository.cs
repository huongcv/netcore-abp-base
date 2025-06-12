using Ord.Plugin.Contract.Dtos;
using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Contract.Repositories
{
    /// <summary>
    /// repository chia sẻ chung cho toàn dựa án
    /// </summary>
    public interface IUserSharedRepository : IScopedDependency
    {
        Task<UserInformationDto?> GetById(Guid userId);
        Task<IEnumerable<Guid>> GetUsersGrantedRole(Guid roleId);
        Task<IEnumerable<Guid>> GetUsersByTenantsAsync(Guid? tenantId);
        Task<DateTime?> GetChangePasswordDateTime(string? userId);
    }
}
