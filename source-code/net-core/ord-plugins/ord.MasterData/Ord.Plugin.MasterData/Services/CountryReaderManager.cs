using Ord.Plugin.Core.Features.DataImporting;
using Ord.Plugin.MasterData.Shared.Dtos;
using Ord.Plugin.MasterData.Shared.Services;

namespace Ord.Plugin.MasterData.Services
{
    public class CountryReaderManager : ExcelReaderService<CountryImportDto>, ICountryReaderManager
    {

        protected override string? MapHeader(string headerExcel)
        {
            if (headerExcel.Contains("dien_thoai")) return "PhoneCode";
            if (headerExcel.Contains("tien_te")) return "CurrencyCode";
            if (headerExcel.Contains("ma")) return "Code";
            if (headerExcel.Contains("ten")) return "Name";
            return null; // Ignore unknown headers
        }

        protected override void ParseCellValueToDto(string propertyName, object? cellValue, CountryImportDto dto)
        {
            switch (propertyName)
            {
                case "Code":
                    dto.Code = cellValue?.ToString();
                    break;
                case "Name":
                    dto.Name = cellValue?.ToString();
                    break;
                case "PhoneCode":
                    dto.PhoneCode = cellValue?.ToString();
                    break;
                case "CurrencyCode":
                    dto.CurrencyCode = cellValue?.ToString();
                    break;
            }
        }

        protected override bool ValidateFileStructure(List<string> headers)
        {
            // Check if required headers exist
            return headers.Any(h => h.Contains("stt")) &&
                   headers.Any(h => h.Contains("ma")) &&
                   headers.Any(h => h.Contains("ten"));
        }
    }
}
