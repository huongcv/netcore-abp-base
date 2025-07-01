using Ord.Domain.Entities.MasterData;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.MasterData.Shared.Dtos;

namespace Ord.Plugin.MasterData.Shared.Repositories
{
    public interface IProvinceRepository : IOrdCrudRepository<ProvinceEntity, int, ProvincePagedInput, ProvincePagedDto, ProvinceDetailDto, CreateProvinceDto, UpdateProvinceDto>
    {
        Task<IEnumerable<ProvincePagedDto>> GetListComboOptions(string? countryCode, bool includeUnActive = false);
        Task<List<string>> GetAllCodesAsync();
        Task<bool> IsCodeExistsAsync(string code);
        Task<bool> CheckIsUsedAsync(string code);
       
    }
}
