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
    public class ProvinceAppService : OrdCrudAppService<ProvinceEntity, int, ProvincePagedInput, ProvincePagedDto, ProvinceDetailDto, CreateProvinceDto, UpdateProvinceDto>
    {
        private IProvinceRepository ProvinceRepository => AppFactory.GetServiceDependency<IProvinceRepository>();

        protected override
            IOrdCrudRepository<ProvinceEntity, int, ProvincePagedInput, ProvincePagedDto, ProvinceDetailDto,
                CreateProvinceDto, UpdateProvinceDto> CrudRepository => ProvinceRepository;

        protected override string GetBasePermissionName()
        {
            return "MasterData.Province";
        }

        [HttpPost]
        [ActionName("GetComboOptions")]
        public async Task<CommonResultDto<List<ComboOptionDto>>> GetComboOptions(GetComboOptionInputDto input)
        {
            var users = await ProvinceRepository.GetListComboOptions(input.IncludeUnActive ?? false);
            var options = users.Select(x => new ComboOptionDto
            {
                Value = x.Code,
                DisplayName = x.Name,
                Data = new
                {
                    x.Id,
                    x.Name,
                    x.Code,
                    x.CountryCode,
                    x.IsActived,
                    EncodedId = IdEncoderService.EncodeId(x.Id)
                }
            }).ToList();
            return AppFactory.CreateSuccessResult(options);
        }
    }
}
