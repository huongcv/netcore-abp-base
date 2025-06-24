using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using Ord.Contract.Entities;
using Ord.Plugin.Auth.Shared.Dtos.Users;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Services.Security;
using Ord.Plugin.Core.Base;
using Ord.Plugin.Core.Utils;
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
        public async Task<CommonResultDto<PagedResultDto<UserAccessTokenDto>>> GetPagedAsync(GetUserAccessTokenPagedInput pagedInput)
        {
            if (!IdEncoderService.TryDecodeId(pagedInput.UserEncodedId, out var userId))
            {
                userId = AppFactory.CurrentUserId.Value;
            }
            var paged = await TokenRepository.GetPagedTokensAsync(userId, pagedInput);
            return CommonResultDto<PagedResultDto<UserAccessTokenDto>>.Ok(paged);
        }
        [OrdAuth]
        public async Task<CommonResultDto<List<UserAccessTokenDto>>> GetMyTokensAsync()
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
        public async Task<CommonResultDto<bool>> RevokeAllTokensAsync(EncodedIdDto input)
        {
            if (!IdEncoderService.TryDecodeId(input.EncodedId, out var userId))
            {
                ValidationExceptionHelper.ThrowNotFound();
            }
            return await UserAccessTokenManager.RevokeAllUserTokensAsync(userId);
        }
        [HttpPost]
        [OrdAuth("AuthPlugin.User.ManageTokens")]
        public async Task<CommonResultDto<bool>> RevokeTokensAsync(RevokeMultipleTokensDto input)
        {
            return await UserAccessTokenManager.RevokeMultipleTokensAsync(input);
        }
        [HttpPost]
        [OrdAuth("AuthPlugin.User.ManageTokens")]
        public async Task<CommonResultDto<bool>> RevokeAllOtherTokensAsync()
        {
            return await UserAccessTokenManager.RevokeAllOtherTokensAsync();
        }
    }
}
