using Castle.Components.DictionaryAdapter;
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

        protected override async Task<List<CountryImportDto>> GetSampleDataOfTemplateImport()
        {
            return new List<CountryImportDto>()
            {
                new CountryImportDto()
                {
                    Code = "VN",
                    Name = "Việt Nam",
                    IsActived = true,
                    PhoneCode = "+84",
                    CurrencyCode = "VNĐ"
                },
                new CountryImportDto()
                {
                    Code = "US",
                    Name = "United States",
                    IsActived = true,
                    PhoneCode = "+1",
                    CurrencyCode = "USD"
                },
                new CountryImportDto()
                {
                    Code = "JP",
                    Name = "Japan",
                    IsActived = true,
                    PhoneCode = "+81",
                    CurrencyCode = "JPY"
                },
                new CountryImportDto()
                {
                    Code = "GB",
                    Name = "United Kingdom",
                    IsActived = true,
                    PhoneCode = "+44",
                    CurrencyCode = "GBP"
                },
                new CountryImportDto()
                {
                    Code = "DE",
                    Name = "Germany",
                    IsActived = true,
                    PhoneCode = "+49",
                    CurrencyCode = "EUR"
                },
                new CountryImportDto()
                {
                    Code = "CN",
                    Name = "China",
                    IsActived = true,
                    PhoneCode = "+86",
                    CurrencyCode = "CNY"
                }
            };
        }
    }
}
