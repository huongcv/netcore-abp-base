using AutoMapper;
using AutoMapper.QueryableExtensions;
using Ord.Domain.Entities.Auth;
using Ord.Plugin.Auth.Shared.Dtos.Settings;
using Ord.Plugin.Contract.Dtos;
using System.Text.RegularExpressions;
using Volo.Abp.Validation;

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

        public async Task InsertBulk(string name, IList<string> values)
        {
            try
            {
                var entities = new List<BlacklistedEntity>();
                foreach (var item in values)
                {
                    entities.Add(new BlacklistedEntity()
                    {
                        Value = item,
                        Name = name
                    });
                }
                await InsertManyAsync(entities, true);
            }
            catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("Duplicate entry") == true)
            {
                var message = ex.InnerException.Message;

                // Ví dụ message: "Duplicate entry 'WEAK_PASSWORD-000000' for key 'IX_system_blacklisted_Name_Value'"
                var match = Regex.Match(message, @"Duplicate entry '(.+)-(.+)' for key");

                if (match.Success)
                {

                    var value = match.Groups[2].Value;

                    throw new AbpValidationException(AppFactory.GetLocalizedMessage("exception.black_list_password_duplicate", match.Groups[2].Value));
                }
                throw;
            }

        }
    }
}
