using Ord.Plugin.Contract.Features.DataImporting;
using Ord.Plugin.MasterData.Shared.Dtos;

namespace Ord.Plugin.MasterData.Shared.Services
{
    public interface ICountryImportManger : IExcelImportService<CountryImportDto>
    {
    }
}
