using Ord.Plugin.Contract.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace Ord.Domain.Entities.MasterData
{
    [Table("system_provinces")]
    public class ProvinceEntity : FullAuditedEntity<int>, IHasActived
    {
        [MaxLength(50)]
        public string? Code { get; set; }
        [MaxLength(200)]
        public string? Name { get; set; }
        [MaxLength(100)]
        public string? Level { get; set; }
        [MaxLength(20)]
        public string? CountryCode { get; set; }
        public bool IsActived { get; set; }
    }
}
