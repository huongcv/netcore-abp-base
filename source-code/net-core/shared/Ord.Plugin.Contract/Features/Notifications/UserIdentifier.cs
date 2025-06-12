using Ord.Plugin.Contract.Factories;

namespace Ord.Plugin.Contract.Features.Notifications
{
    public class UserIdentifier
    {
        public Guid? TenantId { get; protected set; }
        public Guid UserId { get; protected set; }
        protected UserIdentifier()
        {
        }
        public UserIdentifier(Guid? tenantId, Guid userId)
        {
            this.TenantId = tenantId;
            this.UserId = userId;
        }

        public UserIdentifier(IAppFactory appFactory, Guid userId)
        {
            TenantId = appFactory.CurrentTenantId;
            UserId = userId;
        }

        public static List<UserIdentifier> GetCurrentTenantUserIdentifier(IAppFactory appFactory, IEnumerable<Guid> userIds)
        {
            var tenantId = appFactory.CurrentTenantId;
            return userIds.Select(x => new UserIdentifier(tenantId, x)).ToList();
        }
        public static UserIdentifier Parse(string userIdentifierString)
        {
            var strArray = !userIdentifierString.IsNullOrEmpty() ? userIdentifierString.Split('@') : throw new ArgumentNullException(nameof(userIdentifierString), "userAtTenant can not be null or empty!");
            var userId = Guid.Parse(strArray[0]);

            if (strArray.Length == 1)
            {
                return new UserIdentifier((Guid?)null, userId);
            }
            Guid? tenantId = Guid.Parse(strArray[1]);

            return strArray.Length == 2 ? new UserIdentifier(tenantId, userId) : throw new ArgumentException("userAtTenant is not properly formatted", nameof(userIdentifierString));
        }
        public string ToUserIdentifierString()
        {
            return !this.TenantId.HasValue ? this.UserId.ToString() : this.UserId.ToString() + "@" + this.TenantId.ToString();
        }

    }
}
