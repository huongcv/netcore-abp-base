using Ord.Domain.Entities.MasterData;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.MasterData.Shared.Dtos;

namespace Ord.Plugin.MasterData.Shared.Repositories
{
    public interface IDistrictRepository : IOrdCrudRepository<DistrictEntity, int, DistrictPagedInput, DistrictPagedDto, DistrictDetailDto, CreateDistrictDto, UpdateDistrictDto>
    {
        Task<IEnumerable<DistrictPagedDto>> GetListComboOptions(bool includeUnActive = false);
        Task<bool> IsCodeExistsAsync(string code);
        Task<bool> CheckIsUsedAsync(string code);
    }
}
