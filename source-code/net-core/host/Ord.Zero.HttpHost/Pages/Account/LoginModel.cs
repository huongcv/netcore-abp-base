using Dapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.IdentityModel.JsonWebTokens;
using MySqlConnector;
using NUglify.Helpers;
using Ord.Plugin.Contract.Consts;
using Ord.Plugin.Contract.Factories;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Text;
using Volo.Abp.Security.Claims;

namespace OrdWebAppIdentity.Pages.Account
{
    public class UserLoginUiDto
    {
        public Guid Id { get; set; }
        public Guid? TenantId { get; set; }
        public string? PasswordHash { get; set; }
        public string UserName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Name { get; set; }
        public bool IsActived { get; set; }
        public string Level { get; set; }
        public virtual DateTime? ChangePasswordDateTime { get; set; }
    }
    public class LoginModel : PageModel
    {
        private readonly IAppFactory _appFactory;
        private readonly string _connString;
        public LoginModel(IAppFactory appFactory,
            IConfiguration configuration)
        {
            _appFactory = appFactory;
            _connString = configuration.GetConnectionString("Default");
        }

        [BindProperty(Name = "TenantName")]
        public string? TenantName { get; set; }
        [BindProperty(Name = "UserName")]
        [Required]
        public string UserName { get; set; }
        [BindProperty(Name = "Password")]
        [Required]
        public string Password { get; set; }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }
            Guid? tenantId = null;
            await using var conn = new MySqlConnection(_connString);
            await conn.OpenAsync();
            var isSuccess = false;
            if (!string.IsNullOrEmpty(TenantName))
            {
                tenantId = await conn.QueryFirstOrDefaultAsync<Guid?>("select Id from tenants where  `Code` = @Code",
                    new
                    {
                        Code = TenantName
                    });
            }

            var queryUserSql = new StringBuilder($@"select * from users where  UserName = @UserName");
            queryUserSql.Append(tenantId.HasValue ? "  and TenantId  = @TenantId " : "  and TenantId is null ");

            var loginUser = await conn.QueryFirstOrDefaultAsync<UserLoginUiDto>(queryUserSql.ToString(), new
            {
                UserName = UserName,
                TenantId = tenantId,
            });
            if (loginUser != null)
            {
                var hasherPassword = new PasswordHasher<UserLoginUiDto>();
                var validPwd = hasherPassword.VerifyHashedPassword(loginUser, loginUser.PasswordHash, Password);
                if (validPwd == PasswordVerificationResult.Success)
                {
                    var tokenId = _appFactory.GuidGenerator.Create().ToString();
                    var listClaim = new List<Claim>
                        {
                            new Claim(JwtRegisteredClaimNames.Jti, tokenId),
                            new Claim(JwtRegisteredClaimNames.Sub, loginUser.Id.ToString()),
                            new Claim(AbpClaimTypes.UserName, loginUser.UserName),
                            new Claim(AbpClaimTypes.UserId, loginUser.Id.ToString())
                        };
                    if (!string.IsNullOrEmpty(loginUser.Email))
                    {
                        listClaim.Add(new Claim(JwtRegisteredClaimNames.Email, loginUser.Email));
                    }
                    if (!string.IsNullOrEmpty(loginUser.Name))
                    {
                        listClaim.Add(new Claim(AbpClaimTypes.Name, loginUser.Name));
                    }
                    if (loginUser.TenantId.HasValue)
                    {
                        listClaim.Add(new Claim(AbpClaimTypes.TenantId, loginUser.TenantId.Value.ToString()));
                    }

                    if (loginUser.Level == UserConst.SaLevel)
                    {
                        listClaim.Add(new Claim(OrdClaimsTypes.IsSuperAdmin, "1"));
                    }
                    if (loginUser.ChangePasswordDateTime.HasValue)
                    {
                        listClaim.Add(new Claim(OrdClaimsTypes.ChangePasswordDateTime, loginUser.ChangePasswordDateTime.Value.ToString(OrdClaimsTypes.FormatClaimDateType)));
                    }

                    var dynamicClaims = await GetDynamicClaims(loginUser.Id, conn);
                    if (dynamicClaims.Count > 0)
                    {
                        dynamicClaims.ForEach(it =>
                        {
                            if (!string.IsNullOrEmpty(it.Value))
                            {
                                listClaim.Add(new Claim(it.Key, it.Value));
                            }
                        });
                    }
                    var identity = new ClaimsIdentity(listClaim, CookieAuthenticationDefaults.AuthenticationScheme);
                    await HttpContext.SignInAsync(
                        CookieAuthenticationDefaults.AuthenticationScheme,
                        new ClaimsPrincipal(identity),
                        new AuthenticationProperties
                        {
                            IsPersistent = true,
                            AllowRefresh = true,
                            ExpiresUtc = DateTimeOffset.UtcNow.AddMonths(1),
                        });
                    isSuccess = true;
                }
            }

            await conn.CloseAsync();
            if (isSuccess)
            {
                return Redirect("/api-doc");
            }
            return Redirect("/");

        }

        private async Task<Dictionary<string, string>> GetDynamicClaims(Guid userId, MySqlConnection conn)
        {
            var items = await conn.QueryAsync(
                "select Name, Value from  UserClaims where UserId = @UserId ",
                new
                {
                    UserId = userId,
                });
            var ret = new Dictionary<string, string>();
            if (items?.Any() == true)
            {
                foreach (var item in items)
                {
                    if (!ret.ContainsKey(item.Name))
                    {
                        ret.Add(item.Name, item.Value);
                    }
                }
            }

            return ret;
        }
    }
}
