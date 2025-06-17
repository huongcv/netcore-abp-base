using AutoMapper.QueryableExtensions;
using Ord.Plugin.Auth.Shared.Dtos.Tenants;
using Volo.Abp.MultiTenancy;
namespace Ord.Plugin.Auth.Repositories
{
    public class TenantCrudRepository(IAppFactory factory)
         : OrdDefaultCrudRepository<TenantEntity, Guid, TenantPagedInput, TenantPagedDto, TenantDetailDto, CreateTenantDto, UpdateTenantDto>(factory),
             ITenantCrudRepository
    {

        protected override async Task<IQueryable<TenantEntity>> GetPagedQueryableAsync(IQueryable<TenantEntity> queryable, TenantPagedInput input)
        {
            queryable = queryable.WhereLikeText(input.TextSearch, x => new
            {
                x.Code,
                x.Name,
                x.Email,
                x.PhoneNumber,
                x.Address
            })
                .WhereIf(input.IsActived.HasValue, x => x.IsActived == input.IsActived);

            return queryable;
        }

        protected override async Task ProcessPagedItemsAsync(List<TenantPagedDto> items, TenantPagedInput input)
        {
            using (DataFilter.Disable<IMultiTenant>())
            {
                var userQueryable = await GetUserQueryable();
                foreach (var item in items)
                {
                    item.UserCount = await userQueryable.CountAsync(x => x.TenantId == item.Id);
                }
            }
        }

        protected override async Task ValidateBeforeCreateAsync(CreateTenantDto createInput)
        {
            var isCodeUnique = await IsCodeUniqueAsync(createInput.Code);
            if (!isCodeUnique)
            {
                ThrowValidationEx("auth.tenant.code_already_exists", createInput.Code);
            }

        }

        protected override async Task ValidateBeforeUpdateAsync(UpdateTenantDto updateInput, TenantEntity entityUpdate)
        {
            var isCodeUnique = await IsCodeUniqueAsync(updateInput.Code, entityUpdate.Id);
            if (!isCodeUnique)
            {
                ThrowValidationEx("auth.tenant.code_already_exists", updateInput.Code);
            }
        }

        protected override async Task ValidateBeforeDeleteAsync(TenantEntity entityDelete)
        {
            //var hasUsers = await HasUsersAsync(entityDelete.Id);
            //if (hasUsers)
            //{
            //    ThrowValidationEx("auth.tenant.has_users_cannot_delete", entityDelete.Name);
            //}
        }

        public async Task<bool> IsCodeUniqueAsync(string code, Guid? excludeId = null)
        {
            var queryable = await GetQueryableAsync();
            var query = queryable.AsNoTracking()
                .Where(x => x.Code == code);

            if (excludeId.HasValue)
            {
                query = query.Where(x => x.Id != excludeId.Value);
            }

            return !await query.AnyAsync();
        }

        public async Task<bool> IsEmailUniqueAsync(string email, Guid? excludeId = null)
        {
            var queryable = await GetQueryableAsync();
            var query = queryable.AsNoTracking()
                .Where(x => x.Email == email);

            if (excludeId.HasValue)
            {
                query = query.Where(x => x.Id != excludeId.Value);
            }

            return !await query.AnyAsync();
        }

        public async Task<IEnumerable<TenantPagedDto>> GetListComboOptions(bool includeUnActive = false)
        {
            return await GetListAsDtoAsync<TenantPagedDto>(
                x => x.IsActived == true || includeUnActive,
                x => new TenantPagedDto()
                {
                    Id = x.Id,
                    Code = x.Code,
                    Name = x.Name,
                    IsActived = x.IsActived
                }, true);
        }

        public async Task<TenantEntity?> GetByCodeAsync(string code)
        {
            var queryable = await GetQueryableAsync();
            return await queryable.FirstOrDefaultAsync(x => x.Code == code);
        }

        public async Task<bool> HasUsersAsync(Guid tenantId)
        {
            var userQueryable = await GetUserQueryable();
            return await userQueryable.AnyAsync(x => x.TenantId == tenantId);
        }

        public async Task<PagedResultDto<TenantUserDto>> GetPagedUsersByTenantIdAsync(Guid tenantId, TenantUserPagedInput input)
        {
            using (DataFilter.Disable<IMultiTenant>())
            {
                var userQueryable = await GetUserQueryable();
                var query = userQueryable.Where(x => x.TenantId == tenantId)
                    .WhereLikeText(input.TextSearch, x => new
                    {
                        x.UserName,
                        x.Name,
                        x.Email,
                        x.PhoneNumber
                    })
                    .WhereIf(input.IsActived.HasValue, x => x.IsActived == input.IsActived)
                    .OrderByDescending(x => x.CreationTime)
                    .ProjectTo<TenantUserDto>(Mapper.ConfigurationProvider);
                var encodedSer = AppFactory.GetServiceDependency<IIdEncoderService<UserEntity, Guid>>();
                return await QueryPagedResultAsync(query, input, async (dto) =>
                {
                    dto.UserEncodedId = encodedSer.EncodeId(dto.Id);
                });
            }
        }

        protected Task<IQueryable<UserEntity>> GetUserQueryable()
        {
            return GetEntityQueryable<UserEntity>();
        }
    }
}
