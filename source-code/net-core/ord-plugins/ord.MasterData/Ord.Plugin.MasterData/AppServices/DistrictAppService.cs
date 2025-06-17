using Microsoft.AspNetCore.Mvc;
using Ord.Domain.Entities.MasterData;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Core.Services;
using Ord.Plugin.MasterData.Shared.Dtos;
using Ord.Plugin.MasterData.Shared.Repositories;

namespace Ord.Plugin.MasterData.AppServices
{
    [OrdAuth]
    public class DistrictAppService : OrdCrudAppService<DistrictEntity, int, DistrictPagedInput, DistrictPagedDto, DistrictDetailDto, CreateDistrictDto, UpdateDistrictDto>
    {
        private IDistrictRepository DistrictRepository => AppFactory.GetServiceDependency<IDistrictRepository>();

        protected override
            IOrdCrudRepository<DistrictEntity, int, DistrictPagedInput, DistrictPagedDto, DistrictDetailDto,
                CreateDistrictDto, UpdateDistrictDto> CrudRepository => DistrictRepository;

        protected override string GetBasePermissionName()
        {
            return "MasterData.District";
        }

        [HttpPost]
        [ActionName("GetComboOptions")]
        public async Task<CommonResultDto<List<ComboOptionDto>>> GetComboOptions(GetComboOptionInputDto input)
        {
            var users = await DistrictRepository.GetListComboOptions(input.IncludeUnActive ?? false);
            var options = users.Select(x => new ComboOptionDto
            {
                Value = x.Code,
                DisplayName = x.Name,
                Data = new
                {
                    x.Id,
                    x.Name,
                    x.Code,
                    x.ProvinceCode,
                    x.IsActived,
                    EncodedId = IdEncoderService.EncodeId(x.Id)
                }
            }).ToList();
            return AppFactory.CreateSuccessResult(options);
        }
    }
}
