using Ord.Contract.Entities;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Dtos.Auths;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Consts;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Services.Security;
using Ord.Plugin.Core.Utils;
using System.Security.Claims;

namespace Ord.Plugin.Auth.Services
{
    public class UserImpersonationManager : OrdAuthManagerBase, IUserImpersonationManager
    {
        private IIdEncoderService<UserEntity, Guid> IdEncoder => AppFactory.GetServiceDependency<IIdEncoderService<UserEntity, Guid>>();
        private IJwtManager JwtManager => AppFactory.GetServiceDependency<IJwtManager>();
        private IUserRepository UserRepository => AppFactory.GetServiceDependency<IUserRepository>();
        public async Task<CommonResultDto<JwtDto>> LoginAsUserAsync(LoginAsUserInputDto input)
        {
            var targetUserId = IdEncoder.DecodeId(input.EncodedId);
            var hasPermission = await ValidateImpersonationPermissionAsync(targetUserId);
            if (!hasPermission.IsSuccessful)
            {
                return hasPermission.ToErrorResult<JwtDto>();
            }
            var targetUser = hasPermission.Data;
            var claims = new List<Claim>
            {
                new(OrdClaimsTypes.ReturnToAdminId, AppFactory?.CurrentUserId?.ToString()),
                new(OrdClaimsTypes.IsLoginImpersonation, "true"),
            };
            var jwtDto = JwtManager.CreateJwt(targetUser, claims);
            return CommonResultDto<JwtDto>.Ok(jwtDto);
        }

        public async Task<CommonResultDto<UserLoginDto>> ValidateImpersonationPermissionAsync(Guid targetUserId)
        {
            if (!AppFactory.CurrentUserId.HasValue)
            {
                return CommonResultDto<UserLoginDto>.Unauthorized("Chưa đăng nhập");
            }
            // Kiểm tra quyền cụ thể cho impersonation
            var hasPermission = await AppFactory.CheckPermissionAsync("AuthPlugin.User.LoginPasswordless");
            if (!hasPermission)
            {
                return CommonResultDto<UserLoginDto>.Forbidden("Không có quyền đăng nhập");
            }

            // Kiểm tra không được impersonate chính mình
            if (AppFactory.CurrentUserId.Value == targetUserId)
            {
                return CommonResultDto<UserLoginDto>.Failed("Không thể đăng nhập thay chính mình");
            }

            var targetUser = await UserRepository.GetLoginById(targetUserId);
            // Kiểm tra có phải Super Admin hoặc có quyền impersonation
            if (AppFactory.IsSuperAdminLevel())
            {
                return CommonResultDto<UserLoginDto>.Ok(targetUser);
            }


            return CommonResultDto<UserLoginDto>.Ok(targetUser);
        }
    }
}
