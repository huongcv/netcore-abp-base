using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities;

namespace Ord.Domain.Entities.Auth
{
    [Table("system_blacklisted")]
    public class BlacklistedEntity : Entity<int>
    {
        [Required]
        [MaxLength(100)]
        public string? Name { get; set; }
        [Required]
        [MaxLength(300)]
        public string? Value { get; set; }
    }
}
