using Ord.Domain.Entities.MasterData;
using Ord.Plugin.MasterData.Shared.Dtos;
using Ord.Plugin.MasterData.Shared.Repositories;

namespace Ord.EfCore.Default.Repository.MasterData
{
    public class CountryRepository(IAppFactory factory)
        : OrdDefaultCrudRepository<CountryEntity, int, CountryPagedInput, CountryPagedDto, CountryDetailDto, CreateCountryDto, UpdateCountryDto>(factory),
            ICountryRepository
    {
        /// <summary>
        /// Lọc và tìm kiếm dữ liệu phân trang theo điều kiện người dùng nhập
        /// </summary>
        protected override async Task<IQueryable<CountryEntity>> GetPagedQueryableAsync(IQueryable<CountryEntity> queryable, CountryPagedInput input)
        {
            queryable = queryable.WhereLikeText(input.TextSearch, x => new
            {
                x.Code,
                x.Name
            })
            .WhereIf(input.IsActived.HasValue, x => x.IsActived == input.IsActived);

            return queryable;
        }

        /// <summary>
        /// Kiểm tra tính hợp lệ trước khi tạo mới Country (mã không được trùng)
        /// </summary>
        protected override async Task ValidateBeforeCreateAsync(CreateCountryDto createInput)
        {
            var isCodeUnique = await CheckCodeIsUniqueAsync(createInput.Code);
            if (!isCodeUnique)
            {
                ThrowValidationEx("message.crud.code_already_exists", createInput.Code);
            }
        }

        /// <summary>
        /// Kiểm tra tính hợp lệ trước khi cập nhật Country (mã không được trùng với mã khác)
        /// </summary>
        protected override async Task ValidateBeforeUpdateAsync(UpdateCountryDto updateInput, CountryEntity entityUpdate)
        {
            var isCodeUnique = await CheckCodeIsUniqueAsync(entityUpdate.Code, entityUpdate.Id);
            if (!isCodeUnique)
            {
                ThrowValidationEx("message.crud.code_already_exists", entityUpdate.Code);
            }
        }

        /// <summary>
        /// Kiểm tra điều kiện trước khi xóa (nếu đã được sử dụng ở bảng tỉnh/thành thì không cho xóa)
        /// </summary>
        protected override async Task ValidateBeforeDeleteAsync(CountryEntity entityDelete)
        {
            var isUsed = await CheckIsUsedAsync(entityDelete.Code);
            if (isUsed)
            {
                ThrowEntityUsed(entityDelete.Code);
            }
        }

        public async Task<IEnumerable<CountryPagedDto>> GetComboBoxOptionsAsync(bool includeUnActive = false)
        {
            return await GetListAsDtoAsync<CountryPagedDto>(
                x => x.IsActived == true || includeUnActive,
                x => new CountryPagedDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Code = x.Code,
                    IsActived = x.IsActived,
                },
                true);
        }

        /// <summary>
        /// Kiểm tra mã Country có là duy nhất hay không
        /// </summary>
        protected async Task<bool> CheckCodeIsUniqueAsync(string code, int? excludeId = null)
        {
            var queryable = await GetQueryableAsync();
            var query = queryable.AsNoTracking().Where(x => x.Code == code);

            if (excludeId.HasValue)
            {
                query = query.Where(x => x.Id != excludeId.Value);
            }

            return !await query.AnyAsync();
        }

        public Task<bool> IsCodeExistsAsync(string code)
        {
            return ExistsAsync(x => x.Code == code);
        }
        /// <summary>
        /// Kiểm tra mã Country đã được sử dụng ở bảng Province hay chưa
        /// </summary>
        public async Task<bool> CheckIsUsedAsync(string code)
        {
            var provinceQueryable = await GetEntityQueryable<ProvinceEntity>();
            var query = provinceQueryable.AsNoTracking().Where(x => x.CountryCode == code);
            return await query.AnyAsync();
        }
    }
}
