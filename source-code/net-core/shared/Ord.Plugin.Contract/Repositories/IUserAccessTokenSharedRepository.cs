using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Contract.Repositories
{
    public interface IUserAccessTokenSharedRepository : IDomainService
    {
        // kiểm tra jwt có bị thu hồi không
        Task<bool> CheckAccessTokenInActive(string tokenId);
    }
}
