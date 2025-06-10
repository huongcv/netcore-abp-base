using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Http;
using Ord.Plugin.Contract.Consts;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Volo.Abp.Authorization;
using Volo.Abp.Caching;
using Volo.Abp.Threading;

namespace Ord.Plugin.Core.Utils
{
    public static class AppFactoryExtension
    {
        public static UserInformationDto GetUserSession(this IAppFactory factory)
        {
            return AsyncHelper.RunSync(() => GetUserSessionAsync(factory));
        }
        public static Task<UserInformationDto> GetUserSessionAsync(this IAppFactory factory)
        {
            var service = factory.GetServiceDependency<IAppSharedManger>();
            return service.GetUserCurrentAsync();
        }
        public static ShopInformationDto GetShopSession(this IAppFactory factory)
        {
            return AsyncHelper.RunSync(() => GetShopSessionAsync(factory));
        }
        public static Task<ShopInformationDto> GetShopSessionAsync(this IAppFactory factory)
        {
            return null;
            // return factory.Mediator.Send(new GetCurrentShopInformationQuery());
        }
        public static IHttpContextAccessor HttpContextAccessor(this IAppFactory factory)
        {
            return factory.GetServiceDependency<IHttpContextAccessor>();
        }
        public static IDistributedCache<IEnumerable<ComboOptionDto>> ComboOptionsCache(this IAppFactory factory)
        {
            return factory.LazyService<IDistributedCache<IEnumerable<ComboOptionDto>>>();
        }

        public static string GetCurrentLanguge(this IAppFactory factory)
        {
            var header = factory.HttpContextAccessor().HttpContext.Request.Headers;
            var lang = header["Accept-Language"].ToString();
            return string.IsNullOrEmpty(lang) ? "vn" : lang.ToLower();
        }
        public static string GetValueColumnIsActived(this IAppFactory _appFactory, bool isActived)
        {
            var lang = _appFactory.GetCurrentLanguge();
            if (lang == "vn")
            {
                return isActived ? "Đang hoạt động" : "Ngừng hoạt động";
            }
            if (lang == "en")
            {
                return isActived ? "Actived" : "Inactived";
            }
            return isActived.ToString();
        }

        public static async Task<List<Claim>> GetListClaimsFromHeader(this IAppFactory factory)
        {
            try
            {
                if (factory.HttpContextAccessor().HttpContext.Request.Headers.TryGetValue("Authorization", out var values))
                {
                    return ReadClaimsFromToken(factory, values.ToString());
                }
                return null;
            }
            catch
            {
                return null;
            }

        }

        public static List<Claim> ReadClaimsFromToken(this IAppFactory factory, string jwt)
        {
            try
            {
                if (string.IsNullOrEmpty(jwt))
                {
                    return null;
                }
                if (jwt.Contains("Bearer"))
                {
                    jwt = jwt.Replace("Bearer", "").Trim();
                }
                var handler = new JwtSecurityTokenHandler();
                var token = handler.ReadJwtToken(jwt);
                return token.Claims.ToList();
            }
            catch
            {
                return null;
            }
        }

        public static string GetTokenIdFromJwt(this IAppFactory factory)
        {
            var claims = factory.HttpContextAccessor().HttpContext.User.Claims;
            return claims?.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti)?.Value ?? string.Empty;
        }
        public static bool IsSuperAdminLevel(this IAppFactory factory)
        {
            try
            {
                var claims = factory.HttpContextAccessor().HttpContext.User.Claims;
                return claims?.Any(x => x.Value == "1" && x.Type == OrdClaimsTypes.IsSuperAdmin) == true;
            }
            catch
            {
                return false;
            }

        }

        public static async Task<bool> CheckPermissionAsync(this IAppFactory factory, string? permissionName, bool throwEx = false)
        {
            if (string.IsNullOrEmpty(permissionName) || factory.IsSuperAdminLevel())
            {
                return true;
            }
            var isGranted = false;
            if (factory.CurrentUserId.HasValue == true)
            {
                var checker = factory.GetServiceDependency<IPermissionSharedManger>();
                isGranted = await checker.IsGranted(factory.CurrentUserId.Value, permissionName);
            }
            if (throwEx && !isGranted)
            {
                throw new AbpAuthorizationException(code: AbpAuthorizationErrorCodes.GivenPolicyHasNotGrantedWithPolicyName)
                    .WithData("PolicyName", permissionName);
            }
            return isGranted;
        }

        public static async Task<ValidationResult> ValidateDto<TDto>(this IAppFactory factory, TDto input)
        {
            try
            {
                var validator = factory.LazyService<IValidator<TDto>>();
                return await validator.ValidateAsync(input);
            }
            catch
            {
                return new ValidationResult()
                {
                };
            }
        }
    }
}
