using Ord.Plugin.Contract.Attributes;
using Ord.Plugin.Contract.Base;

namespace Ord.Plugin.Contract.Dtos
{
    public class UserBaseDto: IHasActived
    {
        public string UserName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Name { get; set; }
        public bool IsActived { get; set; }
        public string? Level { get; set; }
        public bool IsLockoutEnabled { get; set; }
        public virtual DateTimeOffset? LockoutEnd { get; set; }
        [IgnoreColumnName]
        public Dictionary<string, string>? DynamicInformation { get; set; }
        [IgnoreColumnName]
        public IEnumerable<Guid>? ListRoleId { get; set; }
        [IgnoreColumnName]
        public List<string>? ListPermission { get; set; }
        [IgnoreColumnName]
        public object? ExtendData { get; set; }
        public bool MustChangePassword { get; set; }
        public DateTime? LastModificationTime { get; set; }
        public DateTime? BirthDay { get; set; }

    }
}
