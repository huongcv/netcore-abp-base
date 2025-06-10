using Microsoft.AspNetCore.Mvc;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Contract.Dtos;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Auth.AppServices
{
    [OrdAuth]
    public class RoleAppService : OrdAuthAppService
    {
        private IRoleCrudRepository RoleCrudRepository => AppFactory.GetServiceDependency<IRoleCrudRepository>();
        [HttpPost]
        [OrdAuth("AuthPlugin.Role")]
        public async Task<CommonResultDto<PagedResultDto<RolePagedDto>>> GetPaged(RolePagedInput input)
        {
            var paged = await RoleCrudRepository.GetPagedListAsync(input);
            return AppFactory.CreateSuccessResult(paged);
        }
        [HttpPost]
        [OrdAuth("AuthPlugin.Role")]
        public async Task<CommonResultDto<CounterByIsActivedDto>> GetCountByIsActived(RolePagedInput input)
        {
            return AppFactory.CreateSuccessResult(await RoleCrudRepository.GetCountGroupByIsActivedAsync(input));
        }
        [HttpPost]
        [OrdAuth("AuthPlugin.Role")]
        public async Task<CommonResultDto<RoleDetailDto>> GetById(EncodedIdDto input)
        {
            return AppFactory.CreateSuccessResult(await RoleCrudRepository.GetDetailByEncodedIdAsync(input.EncodedId));
        }
        [HttpPost]
        [OrdAuth("AuthPlugin.Role.Create")]
        public async Task<CommonResultDto<RoleDetailDto>> CreateAsync(CreateRoleDto input)
        {
            var createUser = await RoleCrudRepository.CreateAsync(input);
            return AppFactory.CreateSuccessResult(AppFactory.ObjectMap<RoleEntity, RoleDetailDto>(createUser));
        }
        [HttpPost]
        [OrdAuth("AuthPlugin.Role.Update")]
        public async Task<CommonResultDto<RoleDetailDto>> UpdateAsync(UpdateRoleDto input)
        {
            var updatedRole = await RoleCrudRepository.UpdateByEncodedIdAsync(input.EncodedId, input);
            if (updatedRole == null)
            {
                return CreateNotFoundResult<RoleDetailDto>("crud_user_not_found");
            }
            return AppFactory.CreateSuccessResult(AppFactory.ObjectMap<RoleEntity, RoleDetailDto>(updatedRole));
        }
    }
}
