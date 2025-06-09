using Microsoft.AspNetCore.Identity;
using Ord.Contract.Entities;

namespace Ord.Plugin.Auth.Util
{
    public class UserUtil
    {
        public static string HashPassword(UserEntity user, string password)
        {
            var passwordHasher = new PasswordHasher<UserEntity>();
            return passwordHasher.HashPassword(user, password);
        }
        public static PasswordVerificationResult VerifyPassword(UserEntity user, string password)
        {
            var passwordHasher = new PasswordHasher<UserEntity>();
            if (string.IsNullOrEmpty(password))
            {
                return PasswordVerificationResult.Failed;
            }
            return passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
        }
    }
}
