namespace Ord.Plugin.Auth.Dtos
{
    public class TreeUserHostAssignDto
    {
        public List<TreeUserHostAssignNote>? RoleTreeData { get; set; }

        public List<string>? ListRoleAssignId { get; set; }
    }

    public class TreeUserHostAssignNote
    {
        public string Id { get; set; } = null!;
        public string Name { get; set; } = null!; 
        public string Code { get; set; } = null!; 
    }
}
