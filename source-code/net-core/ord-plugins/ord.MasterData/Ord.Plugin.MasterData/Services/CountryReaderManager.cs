using Microsoft.Extensions.Logging;
using Ord.Plugin.Contract.Features.DataImporting;
using Ord.Plugin.Core.Features.DataImporting;
using Ord.Plugin.MasterData.Shared.Dtos;

namespace Ord.Plugin.MasterData.Services
{
    public class CountryReaderManager: ExcelReaderService<CountryImportDto>,IExcelReaderService<CountryImportDto>
    {
        public CountryReaderManager(ILogger logger) : base(logger)
        {
        }

        protected override string? MapHeader(string headerExcel)
        {
            throw new NotImplementedException();
        }

        protected override void ParseCellValueToDto(string propertyName, object? cellValue, CountryImportDto dto)
        {
            throw new NotImplementedException();
        }

        protected override bool ValidateFileStructure(List<string> headers)
        {
            throw new NotImplementedException();
        }
    }
}
