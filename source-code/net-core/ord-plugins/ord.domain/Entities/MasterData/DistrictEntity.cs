using Ord.Plugin.Contract.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace Ord.Domain.Entities.MasterData
{
    [Table("system_districts")]
    public class DistrictEntity : FullAuditedEntity<int>, IHasActived
    {
        public const int MaxLengthCode = 20;
        public const int MaxLengthName = 200;
        public const int MaxLengthLevel = 50;
        public const int MaxLengthProvinceCode = 20;

        [MaxLength(MaxLengthCode)]
        public string? Code { get; set; }
        [MaxLength(MaxLengthName)]
        public string? Name { get; set; }
        [MaxLength(MaxLengthLevel)]
        public string? Level { get; set; }
        [MaxLength(MaxLengthProvinceCode)]
        public string? ProvinceCode { get; set; }
        public bool IsActived { get; set; }
    }
}
