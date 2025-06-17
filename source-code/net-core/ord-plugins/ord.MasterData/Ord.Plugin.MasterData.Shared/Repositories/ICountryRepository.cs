using Ord.Domain.Entities.MasterData;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.MasterData.Shared.Dtos;

namespace Ord.Plugin.MasterData.Shared.Repositories
{
    public interface ICountryRepository : IOrdCrudRepository<CountryEntity, int, CountryPagedInput, CountryPagedDto, CountryDetailDto, CreateCountryDto, UpdateCountryDto>
    {
        Task<bool> CheckCodeIsUniqueAsync(string code, int? excludeId = null);
        Task<bool> CheckCountryIsUsedAsync(string code);
    }
}
