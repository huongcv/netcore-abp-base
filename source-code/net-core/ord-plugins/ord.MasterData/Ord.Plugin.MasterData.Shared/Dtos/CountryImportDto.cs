using Ord.Plugin.Contract.Features.DataImporting;

namespace Ord.Plugin.MasterData.Shared.Dtos
{
    public class CountryImportDto : CreateCountryDto, IImportDto
    {
        public int? RowNumber { get; set; }
        public List<string>? ErrorMessages { get; set; }
    }
}
