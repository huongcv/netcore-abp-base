using Ord.Plugin.Auth.Shared.Dtos.Auths;
using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Auth.Shared.Services
{
    public interface ILoginFirebaseManager : IDomainService
    {
        Task HandleFirebaseTokenOnLoginAsync(Guid userId, FireBaseDto firebaseDto);
        Task CleanupOldDeviceTokensAsync(Guid userId, string? currentDeviceId = null);
        Task UpdateDeviceLastActiveAsync(Guid userId, string? firebaseToken);
    }
}
