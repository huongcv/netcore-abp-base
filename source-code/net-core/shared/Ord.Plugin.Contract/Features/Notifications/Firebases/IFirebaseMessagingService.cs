using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Core.Features.Notifications.Firebases
{
    public interface IFirebaseMessagingService : ISingletonDependency
    {
        Task<FirebaseSendResult> SendToTokenAsync(string token, FirebaseMessage message);
        Task<FirebaseBatchResult> SendToTokensAsync(List<string> tokens, FirebaseMessage message);
        Task<bool> ValidateTokenAsync(string token);
        Task<bool> IsInitializedAsync();
        Task InitializeAsync();
    }
}
