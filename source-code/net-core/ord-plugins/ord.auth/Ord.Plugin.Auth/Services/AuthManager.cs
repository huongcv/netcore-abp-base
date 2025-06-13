using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.IdentityModel.JsonWebTokens;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Dtos.Auths;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Consts;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Setting;
using Ord.Plugin.Core.Utils;
using Volo.Abp.Caching;
using Volo.Abp.Timing;


namespace Ord.Plugin.Auth.Services
{
    public class AuthManager : OrdAuthManagerBase, IAuthManager
    {
        private const string LoginInvalidError = "login_invalid";
        public async Task<CommonResultDto<JwtDto>> LoginAsync(LoginInputDto loginInput)
        {
            var tenantCode = loginInput.TenantCode;
            Guid? tenantId = null;
            if (!string.IsNullOrEmpty(tenantCode))
            {
                var tenantEnt = await TenantRepos.GetByCode(tenantCode);
                if (tenantEnt == null)
                {
                    return AppFactory.CreateBadRequestResult<JwtDto>("not_found_tenant");
                }

                if (tenantEnt.IsActived != true)
                {
                    return AppFactory.CreateBadRequestResult<JwtDto>("tenant_not_active");
                }
                tenantId = tenantEnt.Id;

            }
            using (CurrentTenant.Change(tenantId))
            {
                var normalizedUserName = NormalizeUserName(loginInput.UserName);
                var userLoginDto = await UserRepos.GetLoginByUserName(normalizedUserName);
                if (userLoginDto == null)
                {
                    return AppFactory.CreateBadRequestResult<JwtDto>(LoginInvalidError);
                }

                if (userLoginDto.IsActived != true)
                {
                    return AppFactory.CreateBadRequestResult<JwtDto>("user_not_active");
                }
                var now = AppFactory.GetServiceDependency<IClock>().Now;
                if (userLoginDto.IsLockoutEnabled)
                {
                    if (userLoginDto.LockoutEnd.HasValue && userLoginDto.LockoutEnd.Value > now)
                    {
                        return AppFactory.CreateBadRequestResult<JwtDto>("user_locked");
                    }
                }
                if (!IsCheckPassword(userLoginDto, loginInput.Password))
                {
                    if (userLoginDto?.IsLockoutEnabled == true)
                    {
                        await UserRepos.IncreaseAccessFailedCount(userLoginDto.Id);
                        var settingRepo = AppFactory.LazyService<ISettingSharedManger>();
                        var maxCountFailed = await settingRepo.GetForApp(SettingNameConst.MaxAccessFailedCount, 5);
                        if (maxCountFailed <= userLoginDto.AccessFailedCount)
                        {
                            var lockInSecond = await settingRepo.GetForApp(SettingNameConst.LockInSecond, 30 * 60);

                            await UserRepos.SetLockUser(userLoginDto.Id, now.AddSeconds(lockInSecond));
                        }
                    }
                    return AppFactory.CreateBadRequestResult<JwtDto>(LoginInvalidError);
                }

                var jwtService = AppFactory.GetServiceDependency<IJwtManager>();
                var jwtDto = jwtService.CreateJwt(userLoginDto);
                jwtDto.UserId = userLoginDto.Id;
                jwtDto.TenantId = userLoginDto.TenantId;
                ClearCacheUserWhenLogin(userLoginDto.Id);
                return AppFactory.CreateSuccessResult(jwtDto);
            }
        }

        public async Task LogoutAsync()
        {
            await AppFactory.ClearCacheUser();
            if (IsRevokeTokenEnabled())
            {
                await RevokeCurrentTokenAsync();
            }
        }

        protected bool IsCheckPassword(UserLoginDto? userLoginDto, string password)
        {
            if (userLoginDto == null)
            {
                return false;
            }

            var passwordHasher = new PasswordHasher<UserLoginDto>();
            var validPass =
                passwordHasher.VerifyHashedPassword(userLoginDto, userLoginDto?.PasswordHash, password);
            return validPass == PasswordVerificationResult.Success;
        }

        protected virtual string NormalizeUserName(string userName)
        {
            if (string.IsNullOrWhiteSpace(userName))
            {
                return string.Empty;
            }
            userName = userName.Trim();
            return userName.ToLowerInvariant();
        }
        private async Task ClearCacheUserWhenLogin(Guid userId)
        {
            var cache = AppFactory.GetServiceDependency<IDistributedCache<UserInformationDto>>();
            await cache.RemoveAsync(userId.ToString());
            await AppFactory.ClearCacheUser(userId);
        }
        private bool IsRevokeTokenEnabled()
        {
            var setting = AppFactory.Configuration["Authentication:IsCheckRevokeToken"];
            return !string.IsNullOrEmpty(setting) && bool.Parse(setting);
        }
        private async Task RevokeCurrentTokenAsync()
        {
            var claims = AppFactory.HttpContextAccessor().HttpContext?.User?.Claims;
            if (claims?.Any() != true)
            {
                return;
            }
            var tokenId = claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti)?.Value;
            if (!string.IsNullOrEmpty(tokenId))
            {
                var cache = AppFactory.GetServiceDependency<IDistributedCache<string>>();
                await cache.SetAsync("RevokeToken:" + tokenId, "1", new DistributedCacheEntryOptions()
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1)
                });
            }
        }

    }
}
