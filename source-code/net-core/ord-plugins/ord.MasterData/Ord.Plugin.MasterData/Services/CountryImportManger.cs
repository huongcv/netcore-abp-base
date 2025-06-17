using Ord.Plugin.Contract.Features.DataImporting;
using Ord.Plugin.Core.Features.DataImporting;
using Ord.Plugin.MasterData.Shared.Dtos;
using Ord.Plugin.MasterData.Shared.Repositories;
using Ord.Plugin.MasterData.Shared.Services;

namespace Ord.Plugin.MasterData.Services
{
    public class CountryImportManger : ExcelImportService<CountryImportDto>, ICountryImportManger
    {
        private ICountryRepository CountryRepository => AppFactory.GetServiceDependency<ICountryRepository>();
        private ImportCheckStringDuplicate codeDuplicateValidate = new();
        protected override async Task PrepareDataForValidationAsync()
        {
            codeDuplicateValidate.SetListValueDb(() => CountryRepository.GetAllCodesAsync());
        }

        protected override async Task<List<string>> ValidateBusinessRulesAsync(CountryImportDto importDto)
        {
            var errors = new List<string>();
            var errorCodeDuplicate = codeDuplicateValidate.Validate(AppFactory, importDto.Code, importDto.RowNumber);
            errors.Concat(errorCodeDuplicate);
            return errors;
        }

        protected override string GetFilePathExportResult()
        {
            throw new NotImplementedException();
        }

        protected override int GetRowIndexStartExcelResult()
        {
            throw new NotImplementedException();
        }

        protected override Task<List<object>> GetDataCellExcelResultAsync(CountryImportDto item)
        {
            throw new NotImplementedException();
        }
    }
}
