using Ord.Plugin.Contract.Factories;

namespace Ord.Plugin.Contract.Features.Authorization.Users
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
            TenantId = tenantId;
            UserId = userId;
        }

        public UserIdentifier(IAppFactory appFactory, Guid userId)
        {
            TenantId = appFactory.CurrentTenantId;
            UserId = userId;
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
            return !TenantId.HasValue ? UserId.ToString() : UserId.ToString() + "@" + TenantId.ToString();
        }

    }
}
