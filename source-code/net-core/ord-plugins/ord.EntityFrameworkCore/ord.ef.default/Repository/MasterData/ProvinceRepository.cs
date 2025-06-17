using Ord.Domain.Entities.MasterData;
using Ord.Plugin.MasterData.Shared.Dtos;
using Ord.Plugin.MasterData.Shared.Repositories;

namespace Ord.EfCore.Default.Repository.MasterData
{
    public class ProvinceRepository(IAppFactory factory)
        : OrdDefaultCrudRepository<ProvinceEntity, int, ProvincePagedInput, ProvincePagedDto, ProvinceDetailDto, CreateProvinceDto, UpdateProvinceDto>(factory),
            IProvinceRepository
    {
        private ICountryRepository CountryRepos => AppFactory.GetServiceDependency<ICountryRepository>();
        /// <summary>
        /// Lọc và tìm kiếm dữ liệu phân trang theo điều kiện người dùng nhập
        /// </summary>
        protected override async Task<IQueryable<ProvinceEntity>> GetPagedQueryableAsync(IQueryable<ProvinceEntity> queryable, ProvincePagedInput input)
        {
            queryable = queryable.WhereLikeText(input.TextSearch, x => new
            {
                x.Code,
                x.Name
            })
            .WhereIfHasValue(input.CountryCode, x => x.CountryCode == input.CountryCode)
            .WhereIfHasValue(input.IsActived, x => x.IsActived == input.IsActived);
            return queryable;
        }

        /// <summary>
        /// Kiểm tra tính hợp lệ trước khi tạo mới Province (mã không được trùng)
        /// </summary>
        protected override async Task ValidateBeforeCreateAsync(CreateProvinceDto createInput)
        {
            var isCodeUnique = await CheckCodeIsUniqueAsync(createInput.Code);
            if (!isCodeUnique)
            {
                ThrowValidationEx("message.crud.code_already_exists", createInput.Code);
            }

            if (string.IsNullOrEmpty(createInput.CountryCode))
            {
                createInput.CountryCode = "vn";
            }
            await CheckCountryCode(createInput.CountryCode);
        }

        /// <summary>
        /// Kiểm tra tính hợp lệ trước khi cập nhật Province (mã không được trùng với mã khác)
        /// </summary>
        protected override async Task ValidateBeforeUpdateAsync(UpdateProvinceDto updateInput, ProvinceEntity entityUpdate)
        {
            var isCodeUnique = await CheckCodeIsUniqueAsync(entityUpdate.Code, entityUpdate.Id);
            if (!isCodeUnique)
            {
                ThrowValidationEx("message.crud.code_already_exists", entityUpdate.Code);
            }
            await CheckCountryCode(updateInput.CountryCode);
        }

        /// <summary>
        /// Kiểm tra điều kiện trước khi xóa (nếu đã được sử dụng ở bảng tỉnh/thành thì không cho xóa)
        /// </summary>
        protected override async Task ValidateBeforeDeleteAsync(ProvinceEntity entityDelete)
        {
            var isUsed = await CheckIsUsedAsync(entityDelete.Code);
            if (isUsed)
            {
                ThrowEntityUsed(entityDelete.Code);
            }
        }

        public async Task<IEnumerable<ProvincePagedDto>> GetListComboOptions(bool includeUnActive = false)
        {
            return await GetListAsDtoAsync<ProvincePagedDto>(
                x => x.IsActived == true || includeUnActive,
                x => new ProvincePagedDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Code = x.Code,
                    CountryCode = x.CountryCode,
                    IsActived = x.IsActived,
                },
                true);
        }

        /// <summary>
        /// Kiểm tra mã có là duy nhất hay không
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

        /// <summary>
        /// Kiểm tra mã province  đã được sử dụng hay chưa
        /// </summary>
        public async Task<bool> CheckIsUsedAsync(string code)
        {
            var queryable = await GetEntityQueryable<DistrictEntity>();
            var query = queryable.AsNoTracking().Where(x => x.ProvinceCode == code);
            return await query.AnyAsync();
        }

        public Task<bool> IsCodeExistsAsync(string code)
        {
            return ExistsAsync(x => x.Code == code);
        }

        protected async Task CheckCountryCode(string countryCode)
        {
            var isCodeExists = await CountryRepos.IsCodeExistsAsync(countryCode);
            if (!isCodeExists)
            {
                ThrowValidationEx("message.business.country_code_not_found", countryCode);
            }
        }
    }
}
