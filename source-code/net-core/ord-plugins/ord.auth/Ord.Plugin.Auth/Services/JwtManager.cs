using Microsoft.IdentityModel.Tokens;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Configurations;
using Ord.Plugin.Contract.Consts;
using Ord.Plugin.Contract.Dtos;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Volo.Abp.Guids;
using Volo.Abp.Security.Claims;

namespace Ord.Plugin.Auth.Services
{
    public class JwtManager(IGuidGenerator guidGenerator): OrdAuthManagerBase,IJwtManager
    {
        public JwtDto CreateJwt(UserLoginDto loginUser)
        {
            if (loginUser == null)
                throw new ArgumentNullException(nameof(loginUser));

            var tokenId = guidGenerator.Create().ToString();
            var claims = BuildUserClaims(loginUser, tokenId);
            return CreateJwt(claims);
        }

        public JwtDto CreateJwt(List<Claim> claims)
        {
            if (claims == null || !claims.Any())
                throw new ArgumentException("Claims cannot be null or empty", nameof(claims));
            var tokenAuthConfiguration = AppFactory.GetServiceDependency<TokenAuthConfiguration>();
            var securityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(tokenAuthConfiguration.SecurityKey));
            var signingCredentials =
                new SigningCredentials(securityKey, tokenAuthConfiguration?.SecurityAlgorithm ?? SecurityAlgorithms.HmacSha512);
            var now = DateTime.UtcNow;
            var accessTokenExpiration = TimeSpan.FromSeconds(tokenAuthConfiguration.TimeLifeTokenSeconds);
            var jwtSecurityToken = new JwtSecurityToken(
                issuer: tokenAuthConfiguration.Issuer,
                audience: tokenAuthConfiguration.Audience,
                claims: claims,
                notBefore: now,
                signingCredentials: signingCredentials,
                expires: now.Add(accessTokenExpiration)
            );
            var accessToken = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
            return new JwtDto()
            {
                AccessToken = accessToken,
                ExpireInSeconds = (int)accessTokenExpiration.TotalSeconds,
            };
        }
        private List<Claim> BuildUserClaims(UserLoginDto loginUser, string tokenId)
        {
            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Jti, tokenId),
                new(JwtRegisteredClaimNames.Sub, loginUser.Id.ToString()),
                new(JwtRegisteredClaimNames.Iat,
                    new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString(),
                    ClaimValueTypes.Integer64),
                new(AbpClaimTypes.UserId, loginUser.Id.ToString())
            };

            // Add optional claims conditionally
            AddOptionalClaim(claims, AbpClaimTypes.UserName, loginUser.UserName);
            AddOptionalClaim(claims, JwtRegisteredClaimNames.Email, loginUser.Email);
            AddOptionalClaim(claims, AbpClaimTypes.Name, loginUser.Name);
            if (loginUser.TenantId.HasValue)
            {
                claims.Add(new Claim(AbpClaimTypes.TenantId, loginUser.TenantId.Value.ToString()));
            }

            if (loginUser.Level == UserConst.SaLevel)
            {
                claims.Add(new Claim(OrdClaimsTypes.IsSuperAdmin, "true"));
            }

            AddDateTimeClaim(claims, OrdClaimsTypes.LastModificationTime, loginUser.LastModificationTime);
            AddDateTimeClaim(claims, OrdClaimsTypes.ChangePasswordDateTime, loginUser.ChangePasswordDateTime);

            return claims;
        }

        private static void AddOptionalClaim(List<Claim> claims, string claimType, string? claimValue)
        {
            if (!string.IsNullOrWhiteSpace(claimValue))
            {
                claims.Add(new Claim(claimType, claimValue));
            }
        }

        private static void AddDateTimeClaim(List<Claim> claims, string claimType, DateTime? dateTime)
        {
            if (dateTime.HasValue)
            {
                claims.Add(new Claim(claimType, dateTime.Value.ToString(OrdClaimsTypes.FormatClaimDateType)));
            }
        }
    }
}
