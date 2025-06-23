namespace Ord.EfCore.Default.Repository.Auth
{
    public class UserPermissionGrantedRepository(IAppFactory appFactory) : DefaultBaseRepository<PermissionUserEntity, Guid>(appFactory), IUserPermissionGrantedRepository
    {
        public async Task DeleteByUserId(Guid userId)
        {
            var queryable = await GetQueryableAsync();
            var deletedEntities = await queryable.Where(x => x.UserId == userId).ToListAsync();
            await DeleteManyAsync(deletedEntities);
        }
    }
}
