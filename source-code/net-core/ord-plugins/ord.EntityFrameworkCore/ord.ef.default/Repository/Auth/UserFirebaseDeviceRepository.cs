using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Features.Notifications.Entities;

namespace Ord.Plugin.Auth.Repositories
{
    public class UserFirebaseDeviceRepository(IAppFactory appFactory)
        : DefaultBaseRepository<UserFirebaseDeviceEntity, Guid>(appFactory), IUserFirebaseDeviceRepository
    {
        public Task<UserFirebaseDeviceEntity?> FindByDeviceIdAsync(Guid userId, string deviceId)
        {
            return GetFirstOrDefaultAsync(x => x.UserId == userId && x.DeviceId == deviceId);
        }

        public Task<UserFirebaseDeviceEntity?> FindByFirebaseTokenAsync(string firebaseToken)
        {
            return GetFirstOrDefaultAsync(x => x.FirebaseToken == firebaseToken);
        }

        public Task<List<UserFirebaseDeviceEntity>> GetByUserIdAsync(Guid userId)
        {
            return GetListAsync(x => x.UserId == userId);
        }

        public Task<int> GetActiveDeviceCountAsync(Guid userId)
        {
            return CountAsync(x => x.UserId == userId);
        }

        public Task DeactivateExpiredTokensAsync()
        {
            throw new NotImplementedException();
        }

        public Task DeactivateUserDevicesAsync(Guid userId)
        {
            throw new NotImplementedException();
        }
    }
}
