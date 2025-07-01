using Ord.Plugin.Contract.Features.DataImporting;
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
        protected override async Task PrepareDataForValidationAsync(List<ProvinceImportDto> rawDataList)
        {
            await _codeDuplicateValidate.SetListValueDbAsync(() => Repository.GetAllCodesAsync());
        }

        protected override async Task<List<string>> ValidateBusinessRulesForRowAsync(ProvinceImportDto importDto)
        {
            var errors = new List<string>();
            var errorCodeDuplicate = _codeDuplicateValidate.Validate(AppFactory, importDto.Code, importDto.RowNumber);
            errors.AddRange(errorCodeDuplicate);
            return errors;
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
