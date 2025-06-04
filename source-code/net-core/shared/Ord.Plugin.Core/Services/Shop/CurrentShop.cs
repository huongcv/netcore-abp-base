using Microsoft.AspNetCore.Http;
using Ord.Plugin.Contract.Consts;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Services.Shop;
using Ord.Plugin.Core.Utils;
using Volo.Abp.Security.Claims;

namespace Ord.Plugin.Core.Services.Shop
{
    public class CurrentShop : ICurrentShop
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ICurrentPrincipalAccessor _currentPrincipalAccessor;
        private readonly IAppFactory _appFactory;
        private int? _shopId;

        public CurrentShop(IHttpContextAccessor httpContextAccessor, IAppFactory appFactory, ICurrentPrincipalAccessor currentPrincipalAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _appFactory = appFactory;
            _currentPrincipalAccessor = currentPrincipalAccessor;
        }

        public int? ShopId
        {
            get
            {
                //if (!_appFactory.CurrentUserId.HasValue)
                //{
                //    return null;
                //}

                if (_shopId != null)
                {
                    return _shopId;
                }

                
                try
                {
                    
                    if (_httpContextAccessor.HttpContext != null && !string.IsNullOrEmpty(_httpContextAccessor.HttpContext.Request.Headers["x-shop-current-anonymous"]))
                    {
                        return Convert.ToInt32(
                            _httpContextAccessor.HttpContext.Request.Headers["x-shop-current-anonymous"]);
                    }
                    // string headerShopValue = _httpContextAccessor.HttpContext.Request.Headers["x-shop-current"];
                    // if (!string.IsNullOrEmpty(headerShopValue))
                    // {
                    //     var userId = _appFactory.CurrentUserId.Value.ToString();
                    //     var encryptionService =
                    //         _appFactory.GetServiceDependency<IStringEncryptionService>();
                    //     var plainShopId = encryptionService.Decrypt(headerShopValue);
                    //     if (!string.IsNullOrEmpty(plainShopId) && plainShopId.StartsWith(userId))
                    //     {
                    //         return Convert.ToInt32(plainShopId.Replace(userId, ""));
                    //     }
                    // }
                   
                    var claimsHttp = _appFactory.HttpContextAccessor().HttpContext?.User?.Claims;

                    if(claimsHttp != null)
                    {
                        var currentShopId = claimsHttp.FirstOrDefault(x => x.Type == OrdClaimsTypes.CurrentShopId)?.Value;
                        if (!string.IsNullOrEmpty(currentShopId))
                        {
                            return Convert.ToInt32(currentShopId);
                        }

                        return null;
                    }
                    else
                    {
                        var allClaims = _currentPrincipalAccessor.Principal.Claims.ToList();
                        var currentShopId = allClaims.FirstOrDefault(x => x.Type == OrdClaimsTypes.CurrentShopId)?.Value;
                        if (!string.IsNullOrEmpty(currentShopId))
                        {
                            return Convert.ToInt32(currentShopId);
                        }

                        return null;
                    }
                    

                    return null; 
                }
                catch
                {
                    return null;
                }
            }
        }
        public void ChangeShop(int shopId)
        {
            if (_httpContextAccessor.HttpContext != null)
            {
                _httpContextAccessor.HttpContext.Request.Headers["x-shop-current-anonymous"] = shopId.ToString();
            }
            _shopId = shopId;
        }
    }
}
