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
    public class CountryAppService : OrdCrudAppService<CountryEntity, int, CountryPagedInput, CountryPagedDto, CountryDetailDto, CreateCountryDto, UpdateCountryDto>
    {
        private ICountryRepository CountryRepository => AppFactory.GetServiceDependency<ICountryRepository>();

        protected override
            IOrdCrudRepository<CountryEntity, int, CountryPagedInput, CountryPagedDto, CountryDetailDto,
                CreateCountryDto, UpdateCountryDto> CrudRepository => CountryRepository;

        protected override string GetBasePermissionName()
        {
            return "MasterData.Country";
        }

        [HttpPost]
        [ActionName("GetComboOptions")]
        public async Task<CommonResultDto<List<ComboOptionDto>>> GetComboOptions(GetComboOptionInputDto input)
        {
            var users = await CountryRepository.GetListComboOptions(input.IncludeUnActive ?? false);
            var options = users.Select(x => new ComboOptionDto
            {
                Value = x.Code,
                DisplayName = x.Name,
                Data = new
                {
                    x.Id,
                    x.Name,
                    x.Code,
                    x.IsActived,
                    EncodedId = IdEncoderService.EncodeId(x.Id)
                }
            }).ToList();
            return AppFactory.CreateSuccessResult(options);
        }
    }
}
