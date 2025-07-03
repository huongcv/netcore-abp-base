using Ord.Plugin.Auth.Shared.Dtos.Settings;
using Volo.Abp.Security.Encryption;

namespace Ord.EfCore.Default.Repository.Auth
{
    public class SettingCrudRepository(IAppFactory factory)
        : OrdDefaultCrudRepository<SettingEntity, Guid, SettingPagedInput, SettingPagedDto, SettingDetailDto, CreateSettingDto, UpdateSettingDto>(factory),
            ISettingCrudRepository
    {
        private IStringEncryptionService EncryptionService =>
            AppFactory.GetServiceDependency<IStringEncryptionService>();
        protected override async Task<IQueryable<SettingEntity>> GetPagedQueryableAsync(IQueryable<SettingEntity> queryable, SettingPagedInput input)
        {
            queryable = queryable.AsNoTracking()
                .WhereLikeText(input.TextSearch, x => new
                {
                    x.Name
                })
                .WhereIf(input.Type.HasValue, x => x.Type == input.Type)
                .WhereIf(input.IsStatic.HasValue, x => x.IsStatic == input.IsStatic)
                .WhereIf(input.IsActived.HasValue, x => x.IsActived == input.IsActived);
            return queryable;
        }
        protected override async Task ProcessPagedItemsAsync(List<SettingPagedDto> items, SettingPagedInput input)
        {
            foreach (var item in items)
            {
                if (item.MustEncrypt == true)
                {
                    item.Value = "***********";
                }
            }
        }

        protected override async Task ValidateBeforeCreateAsync(CreateSettingDto createInput)
        {
            var isCodeUnique = await IsNameUniqueAsync(createInput.Name);
            if (!isCodeUnique)
            {
                ThrowValidationEx("setting_name_already_exists", createInput.Name);
            }

            if (createInput.MustEncrypt == true)
            {
                createInput.Value = EncryptionService.Encrypt(createInput.Value);
            }
        }

        protected override async Task ValidateBeforeUpdateAsync(UpdateSettingDto updateInput, SettingEntity entityUpdate)
        {
            var isCodeUnique = await IsNameUniqueAsync(updateInput.Name, entityUpdate.Id);
            if (!isCodeUnique)
            {
                ThrowValidationEx("setting_name_already_exists", updateInput.Name);
            }
            if (updateInput.MustEncrypt == true)
            {
                updateInput.Value = EncryptionService.Encrypt(updateInput.Value);
            }
        }

        protected override async Task ValidateBeforeDeleteAsync(SettingEntity entityDelete)
        {
            if (entityDelete.IsStatic == true)
            {
                ThrowValidationEx("setting_is_static_not_remove", entityDelete.Name);
            }
        }
        private async Task<bool> IsNameUniqueAsync(string name, Guid? excludeId = null)
        {
            var queryable = await GetQueryableAsync();
            var query = queryable.AsNoTracking().Where(x => x.Name == name);

            if (excludeId.HasValue)
            {
                query = query.Where(x => x.Id != excludeId.Value);
            }

            return !await query.AnyAsync();
        }
    }
}
