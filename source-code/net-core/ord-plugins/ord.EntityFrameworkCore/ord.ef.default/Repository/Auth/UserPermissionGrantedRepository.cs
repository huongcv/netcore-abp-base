namespace Ord.EfCore.Default.Repository.Auth
{
    public class UserPermissionGrantedRepository(IAppFactory appFactory) : DefaultBaseRepository<PermissionUserEntity, Guid>(appFactory), IUserPermissionGrantedRepository
    {
        public async Task DeleteByUserId(Guid userId)
        {
            await DapperHelper.ExecuteAsync(@$"
            DELETE from permissionusers where UserId =  @UserId
            ", new
            {
                UserId = userId
            });
        }

        public async Task<int> InsertMany(IEnumerable<PermissionUserEntity> entities)
        {
            const string sql = @"
            INSERT INTO permissionusers (Id, UserId, PermissionName, IsGrant)
            VALUES (@Id, @UserId, @PermissionName, @IsGrant)
            ";
            foreach (var e in entities)
            {
                if (e.Id == Guid.Empty || e.Id.Equals(default))
                {
                    e.SetId(AppFactory.GuidGenerator.Create());
                }
            }
            return await DapperHelper.ExecuteAsync(sql, entities);
        }
    }
}
