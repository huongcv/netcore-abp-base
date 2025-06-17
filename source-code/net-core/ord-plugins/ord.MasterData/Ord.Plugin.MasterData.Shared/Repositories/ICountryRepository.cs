using Ord.Domain.Entities.MasterData;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.MasterData.Shared.Dtos;

namespace Ord.Plugin.MasterData.Shared.Repositories
{
    public interface ICountryRepository : IOrdCrudRepository<CountryEntity, int, CountryPagedInput, CountryPagedDto, CountryDetailDto, CreateCountryDto, UpdateCountryDto>
    {
        Task<IEnumerable<CountryPagedDto>> GetComboBoxOptionsAsync(bool includeUnActive = false);
        Task<bool> IsCodeExistsAsync(string code);
        Task<bool> CheckIsUsedAsync(string code);
    }
}
