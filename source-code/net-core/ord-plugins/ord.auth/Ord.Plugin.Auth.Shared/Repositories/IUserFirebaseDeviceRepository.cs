using Ord.Plugin.Contract.Features.Notifications.Entities;
using Volo.Abp.Domain.Repositories;

namespace Ord.Plugin.Auth.Shared.Repositories
{
    public interface IUserFirebaseDeviceRepository:IBasicRepository<UserFirebaseDeviceEntity, Guid>
    {
        Task<UserFirebaseDeviceEntity?> FindByDeviceIdAsync(Guid userId, string deviceId);
        Task<UserFirebaseDeviceEntity?> FindByFirebaseTokenAsync(string firebaseToken);
        Task<List<UserFirebaseDeviceEntity>> GetByUserIdAsync(Guid userId);
        Task<int> GetActiveDeviceCountAsync(Guid userId);
        Task DeactivateExpiredTokensAsync();
        Task DeactivateUserDevicesAsync(Guid userId);
    }
}
