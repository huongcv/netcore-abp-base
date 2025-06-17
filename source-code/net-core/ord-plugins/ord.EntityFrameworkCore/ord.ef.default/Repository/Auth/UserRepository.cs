namespace Ord.Plugin.Auth.Repositories
{
    public partial class UserRepository(IAppFactory factory)
        : DefaultBaseRepository<UserEntity, Guid>(factory), IUserRepository
    {
        public async Task<UserLoginDto?> GetLoginByUserName(string? userName)
        {
            var queryable = await GetUserQueryable();
            var userEntity = await queryable
                .Where(x => x.UserName == userName)
                .FirstOrDefaultAsync();
            return AppFactory.ObjectMap<UserEntity, UserLoginDto>(userEntity);
        }

        #region Update or create

        public async Task IncreaseAccessFailedCount(Guid id)
        {
            await UpdateById(id, user =>
            {
                user.AccessFailedCount = user.AccessFailedCount++;
            });
        }
        public async Task SetLockUser(Guid id, DateTime lockoutEnd)
        {
            await UpdateById(id, user =>
            {
                user.LockoutEnd = lockoutEnd;
            });
        }

        #endregion
    }
}
