using Ord.Plugin.Contract.Features.DataImporting;
using Ord.Plugin.Contract.Utils;
using Ord.Plugin.Core.Factories.Extensions;
using Ord.Plugin.Core.Features.DataImporting;
using Ord.Plugin.MasterData.Shared.Dtos;
using Ord.Plugin.MasterData.Shared.Repositories;
using Ord.Plugin.MasterData.Shared.Services;

namespace Ord.Plugin.MasterData.Services
{
    public class ProvinceImportManager : ExcelImportService<ProvinceImportDto>, IProvinceImportManager
    {
        private IProvinceRepository Repository => AppFactory.GetServiceDependency<IProvinceRepository>();
        private ImportCheckStringDuplicate _codeDuplicateValidate = new();
        private List<string> _countryCodeList = new List<string>();
        protected override async Task PrepareDataForValidationAsync(List<ProvinceImportDto> rawDataList)
        {
            await _codeDuplicateValidate.SetListValueDbAsync(() => Repository.GetAllCodesAsync());
            _countryCodeList = await AppFactory.GetServiceDependency<ICountryRepository>().GetAllCodesAsync();
            if (_countryCodeList?.Any() == true)
            {
                _countryCodeList = _countryCodeList.Select(x => x.ToUpper()).ToList();
            }
        }

        protected override async Task<List<string>> ValidateBusinessRulesForRowAsync(ProvinceImportDto importDto)
        {
            var errors = new List<string>();
            var errorCodeDuplicate = _codeDuplicateValidate.Validate(AppFactory, importDto.Code, importDto.RowNumber);
            errors.AddRange(errorCodeDuplicate);
            errors.AddIfNotNull(CheckCountryCode(importDto));
            return errors;
        }

        private string CheckCountryCode(ProvinceImportDto importDto)
        {
            if (string.IsNullOrEmpty(importDto.CountryCode))
            {
                return null;
            }
            var countryCode = importDto.CountryCode.ToUpper();
            return !_countryCodeList.Contains(countryCode) ? "message.validation.not_found_country_code" : null;
        }

        protected override string GetFilePathExportResult()
        {
            return AppFactory.BuildLocalizedExcelFilePath("ListProvince", "MasterData");
        }

        protected override int GetRowIndexStartExcelResult()
        {
            return 2;
        }

        protected override async Task<List<object>> GetDataCellExcelResultAsync(ProvinceImportDto item)
        {
            return new()
            {
                item.Code,
                item.Name,
                item.CountryCode,
                item.Level,
                AppFactory.GetLocalizedIsActive(item.IsActived)
            };
        }

        protected override async Task<List<ProvinceImportDto>> GetSampleDataOfTemplateImport()
        {
            return new List<ProvinceImportDto>()
            {
                new ProvinceImportDto()
                {
                    Code = "01",
                    Name = "Thành phố Hà Nội",
                    Level = "Thành phố Trung ương",
                    CountryCode = "VN",
                    IsActived = true
                }
            };
        }
    }
}
