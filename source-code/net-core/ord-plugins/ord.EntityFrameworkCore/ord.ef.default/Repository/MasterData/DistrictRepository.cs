using Ord.Domain.Entities.MasterData;
using Ord.Plugin.MasterData.Shared.Dtos;
using Ord.Plugin.MasterData.Shared.Repositories;
using System.Linq;

namespace Ord.EfCore.Default.Repository.MasterData
{
    public class DistrictRepository(IAppFactory factory)
        : OrdDefaultCrudRepository<DistrictEntity, int, DistrictPagedInput, DistrictPagedDto, DistrictDetailDto, CreateDistrictDto, UpdateDistrictDto>(factory),
            IDistrictRepository
    {
        private IProvinceRepository ProvinceRepos => AppFactory.GetServiceDependency<IProvinceRepository>();
        /// <summary>
        /// Lọc và tìm kiếm dữ liệu phân trang theo điều kiện
        /// </summary>
        protected override async Task<IQueryable<DistrictEntity>> GetPagedQueryableAsync(IQueryable<DistrictEntity> queryable, DistrictPagedInput input)
        {
            queryable = queryable.WhereLikeText(input.TextSearch, x => new
            {
                x.Code,
                x.Name
            })
            .WhereIfHasValue(input.ProvinceCode, x => x.ProvinceCode == input.ProvinceCode)
            .WhereIf(input.IsActived.HasValue, x => x.IsActived == input.IsActived);

            return queryable;
        }
        protected virtual async Task<IQueryable<DistrictJoinedProjection>> CreateDistrictJoinedQueryAsync(
            IQueryable<DistrictEntity> queryable)
        {
            var provinceQueryable = await GetEntityQueryable<ProvinceEntity>();
            return from d in queryable
                   join p in provinceQueryable on d.ProvinceCode equals p.Code
                   select new DistrictJoinedProjection
                   {
                       Province = p,
                       District = d
                   };
        }


        protected override async Task<IQueryable<DistrictPagedDto>> TransformToPagedDtoAsync(IQueryable<DistrictEntity> entityQueryable, DistrictPagedInput input)
        {
            var joinedQueryable = await CreateDistrictJoinedQueryAsync(entityQueryable);
            return joinedQueryable.Select(x => new DistrictPagedDto()
            {
                Id = x.District.Id,
                Name = x.District.Name,
                Code = x.District.Code,
                ProvinceCode = x.District.ProvinceCode,
                CreationTime = x.District.CreationTime,
                ProvinceName = x.Province.Name
            });
        }

        protected override async Task<IQueryable<DistrictDetailDto>> GenerateDetailByIdQueryableAsync(IQueryable<DistrictEntity> entityQueryable)
        {
            var queryable = await CreateDistrictJoinedQueryAsync(entityQueryable);
            return queryable.Select(x => new DistrictDetailDto()
            {
                Id = x.District.Id,
                Name = x.District.Name,
                Code = x.District.Code,
                ProvinceCode = x.District.ProvinceCode,
                CreationTime = x.District.CreationTime,
                ProvinceName = x.Province.Name
            });
        }

        /// <summary>
        /// Kiểm tra tính hợp lệ trước khi tạo mới 
        /// </summary>
        protected override async Task ValidateBeforeCreateAsync(CreateDistrictDto createInput)
        {
            var isCodeUnique = await CheckCodeIsUniqueAsync(createInput.Code);
            if (!isCodeUnique)
            {
                ThrowValidationEx("message.crud.code_already_exists", createInput.Code);
            }
            await CheckProvinceCode(createInput.ProvinceCode);
        }

        /// <summary>
        /// Kiểm tra tính hợp lệ trước khi cập nhật 
        /// </summary>
        protected override async Task ValidateBeforeUpdateAsync(UpdateDistrictDto updateInput, DistrictEntity entityUpdate)
        {
            var isCodeUnique = await CheckCodeIsUniqueAsync(entityUpdate.Code, entityUpdate.Id);
            if (!isCodeUnique)
            {
                ThrowValidationEx("message.crud.code_already_exists", entityUpdate.Code);
            }
            await CheckProvinceCode(updateInput.ProvinceCode);
        }

        /// <summary>
        /// Kiểm tra điều kiện trước khi xóa (nếu đã được sử dụng ở bảng tỉnh/thành thì không cho xóa)
        /// </summary>
        protected override async Task ValidateBeforeDeleteAsync(DistrictEntity entityDelete)
        {
            var isUsed = await CheckIsUsedAsync(entityDelete.Code);
            if (isUsed)
            {
                ThrowEntityUsed(entityDelete.Code);
            }
        }

        public async Task<IEnumerable<DistrictPagedDto>> GetListComboOptions(bool includeUnActive = false)
        {
            return await GetListAsDtoAsync<DistrictPagedDto>(
                x => x.IsActived == true || includeUnActive,
                x => new DistrictPagedDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Code = x.Code,
                    ProvinceCode = x.ProvinceCode,
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
        /// Kiểm tra mã District  đã được sử dụng ...  hay chưa
        /// </summary>
        public async Task<bool> CheckIsUsedAsync(string code)
        {
            return false;
        }

        public Task<bool> IsCodeExistsAsync(string code)
        {
            return ExistsAsync(x => x.Code == code);
        }

        protected async Task CheckProvinceCode(string provinceCode)
        {
            var isCodeExists = await ProvinceRepos.IsCodeExistsAsync(provinceCode);
            if (!isCodeExists)
            {
                ThrowValidationEx("message.business.province_code_not_found", provinceCode);
            }
        }
    }
}

#region Projection class 

public class DistrictJoinedProjection
{
    public ProvinceEntity? Province { get; set; }
    public DistrictEntity? District { get; set; }
}


#endregion