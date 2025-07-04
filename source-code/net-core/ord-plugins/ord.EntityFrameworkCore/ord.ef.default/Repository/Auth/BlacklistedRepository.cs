using AutoMapper;
using AutoMapper.QueryableExtensions;
using Ord.Domain.Entities.Auth;
using Ord.Plugin.Auth.Shared.Dtos.Settings;
using Ord.Plugin.Contract.Dtos;

namespace Ord.EfCore.Default.Repository.Auth
{
    public class BlacklistedCrudRepository(IAppFactory appFactory) : DefaultBaseRepository<BlacklistedEntity, int>(appFactory), IBlacklistedCrudRepository
    {
        private IIdEncoderService<BlacklistedEntity, int> IdEncoder =>
            AppFactory.GetServiceDependency<IIdEncoderService<BlacklistedEntity, int>>();
        public async Task<PagedResultDto<BlacklistedDto>> GetPaged(string name, OrdPagedRequestDto input)
        {
            var mapper = AppFactory.GetServiceDependency<IMapper>();
            var queryable = await GetQueryableAsNoTracking();
            var q = queryable.Where(x => x.Name == name)
                .WhereLikeText(input.TextSearch, x => new
                {
                    x.Value
                }).OrderBy(x => x.Value)
                .ProjectTo<BlacklistedDto>(mapper.ConfigurationProvider);
            var paged = await q.GetPagedResultAsync(input);
            if (paged.Items?.Any() == true)
            {
                foreach (var item in paged.Items)
                {
                    item.EncodedId = IdEncoder.EncodeId(item.Id);
                }
            }
            return paged;
        }
    }
}
