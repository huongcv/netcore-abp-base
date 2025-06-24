using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using Ord.Contract.Entities;
using Ord.Plugin.Auth.Shared.Dtos.Users;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Services.Security;
using Ord.Plugin.Core.Base;
using Ord.Plugin.Core.Services;
using Ord.Plugin.Core.Utils;
using System.Linq.Dynamic.Core;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Auth.AppServices
{
    [OrdAuth]
    public class UserAccessTokenAppService : OrdAppServiceBase
    {
        private IUserAccessTokenRepository TokenRepository =>
            AppFactory.GetServiceDependency<IUserAccessTokenRepository>();
        private IUserAccessTokenManager UserAccessTokenManager =>
            AppFactory.GetServiceDependency<IUserAccessTokenManager>();
        private IIdEncoderService<UserEntity, Guid> IdEncoderService => AppFactory.GetServiceDependency<IIdEncoderService<UserEntity, Guid>>();
        protected override string GetBasePermissionName()
        {
            return "AuthPlugin.User";
        }
        [HttpPost]
        [OrdAuth("AuthPlugin.User.ManageTokens")]
        public async Task<CommonResultDto<PagedResultDto<UserAccessTokenDto>>> GetPaged(GetUserAccessTokenPagedInput pagedInput)
        {
            if (!IdEncoderService.TryDecodeId(pagedInput.UserEncodedId, out var userId))
            {
                userId = AppFactory.CurrentUserId.Value;
            }
            var paged = await TokenRepository.GetPagedTokensAsync(userId, pagedInput);
            if (paged?.Items?.Any() == true && userId == AppFactory.CurrentUserId)
            {
                var claims = AppFactory.HttpContextAccessor().HttpContext?.User?.Claims;
                var tokenId = claims?.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti)?.Value; 
                foreach (var token in paged.Items)
                {
                    token.IsCurrentToken = string.Equals(tokenId, token.TokenId);
                }
            }
            return CommonResultDto<PagedResultDto<UserAccessTokenDto>>.Ok(paged);
        }
        [HttpPost]
        [ActionName("GetCountByStatus")]
        public virtual async Task<CommonResultDto<List<CounterByStatusItemDto>>> GetCountByStatus(GetUserAccessTokenPagedInput input)
        {
            if (!IdEncoderService.TryDecodeId(input.UserEncodedId, out var userId))
            {
                userId = AppFactory.CurrentUserId.Value;
            }
            await CheckPermissionForOperation(CrudOperationType.GetPaged);
            var counter = await TokenRepository.GetCountByStatus(userId,input);
            return AppFactory.CreateSuccessResult(counter);
        }
        [OrdAuth]
        public async Task<CommonResultDto<List<UserAccessTokenDto>>> GetMyTokens()
        {
            var tokens = await UserAccessTokenManager.GetMyTokensAsync();
            var claims = AppFactory.HttpContextAccessor().HttpContext?.User?.Claims;
            var tokenId = claims?.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti)?.Value; ;
            foreach (var token in tokens)
            {
                token.IsCurrentToken = string.Equals(tokenId, token.TokenId);
            }
            return CommonResultDto<List<UserAccessTokenDto>>.Ok(tokens);
        }
        [HttpPost]
        [OrdAuth("AuthPlugin.User.ManageTokens")]
        public async Task<CommonResultDto<bool>> RevokeAllTokens(EncodedIdDto input)
        {
            if (!IdEncoderService.TryDecodeId(input.EncodedId, out var userId))
            {
                ValidationExceptionHelper.ThrowNotFound();
            }
            return await UserAccessTokenManager.RevokeAllUserTokensAsync(userId);
        }
        [HttpPost]
        [OrdAuth("AuthPlugin.User.ManageTokens")]
        public async Task<CommonResultDto<bool>> RevokeTokens(RevokeMultipleTokensDto input)
        {
            return await UserAccessTokenManager.RevokeMultipleTokensAsync(input);
        }
        [HttpPost]
        [OrdAuth("AuthPlugin.User.ManageTokens")]
        public async Task<CommonResultDto<bool>> RevokeAllOtherTokens()
        {
            return await UserAccessTokenManager.RevokeAllOtherTokensAsync();
        }
    }
}
