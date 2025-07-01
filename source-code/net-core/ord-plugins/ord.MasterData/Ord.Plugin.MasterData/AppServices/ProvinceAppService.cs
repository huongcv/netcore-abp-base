using Microsoft.AspNetCore.Mvc;
using Ord.Domain.Entities.MasterData;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.DataImporting;
using Ord.Plugin.Core.Services;
using Ord.Plugin.MasterData.Shared.Dtos;
using Ord.Plugin.MasterData.Shared.Repositories;
using Ord.Plugin.MasterData.Shared.Services;
using Volo.Abp.Application.Dtos;

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
        public async Task<CommonResultDto<List<ComboOptionDto>>> GetComboOptions(GetProvinceComboOptionInputDto input)
        {
            var users = await ProvinceRepository.GetListComboOptions(
                input.CountryCode,
                input.IncludeUnActive ?? false);
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
        protected override async Task<byte[]> GenerateExcelFileAsync(PagedResultDto<ProvincePagedDto> pagedResult, ProvincePagedInput input)
        {
            // sử dụng chung file mẫu khi xuất với file mẫu import
            var dataExport = pagedResult.Items
                .Select(x => AppFactory.ObjectMap<ProvincePagedDto, ProvinceImportDto>(x)).ToList();
            var importService = AppFactory.GetServiceDependency<IProvinceImportManager>();
            return await importService.ExportResultDataAsync(dataExport);
        }
    }
}
