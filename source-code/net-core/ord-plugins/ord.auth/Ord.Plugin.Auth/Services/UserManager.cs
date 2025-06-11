using Microsoft.AspNetCore.Identity;
using Ord.Contract.Entities;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Auth.Util;
using Ord.Plugin.Contract.Exceptions;
using Ord.Plugin.Core.Utils;
using Volo.Abp.Validation;

namespace Ord.Plugin.Auth.Services
{
    public class UserManager(IUserCrudRepository userCrudRepository) : OrdAuthManagerBase, IUserManager
    {
        public async Task ResetPasswordAsync(Guid userId, string newPassword, bool mustChangePassword = true)
        {
            var userEnt = await GetById(userId);
            userEnt.PasswordHash = UserUtil.HashPassword(userEnt, newPassword);
            userEnt.MustChangePassword = mustChangePassword;
            await AppFactory.ClearCacheUser(userId);
        }

        public async Task ChangePasswordAsync(Guid userId, string oldPassword, string newPassword)
        {
            var userEnt = await GetById(userId);
            var verifyOldPassword = UserUtil.VerifyPassword(userEnt, oldPassword);
            if (verifyOldPassword != PasswordVerificationResult.Success)
            {
                throw new AbpValidationException("old_password_invalid");
            }
            userEnt.PasswordHash = UserUtil.HashPassword(userEnt, newPassword);
            await AppFactory.ClearCacheUser(userId);
        }

        public async Task Unlock(Guid userId)
        {
            var userEnt = await GetById(userId);
            userEnt.LockoutEnd = null;
            await userCrudRepository.UpdateAsync(userEnt);
            await AppFactory.ClearCacheUser(userId);
        }

        public async Task AssignRoles(Guid userId, List<Guid> listOfRoleId)
        {
            var userEnt = await GetById(userId);
            var userRoleRepos = AppFactory.GetServiceDependency<IUserRoleRepository>();
            await userRoleRepos.AssignRolesToUserAsync(userId, listOfRoleId);
        }

        protected async Task<UserEntity> GetById(Guid userId)
        {
            var userEnt = await userCrudRepository.GetByIdAsync(userId);
            if (userEnt == null)
            {
                throw new EntityNotFoundException();
            }

            return userEnt;
        }
        public async Task<string> GenerateRandomPassword(Guid userId)
        {
            var newPassword = GenerateRandomPasswordString();
            await ResetPasswordAsync(userId, newPassword, mustChangePassword: true);
            return newPassword;
        }
        private string GenerateRandomPasswordString()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz@#$";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 12)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
