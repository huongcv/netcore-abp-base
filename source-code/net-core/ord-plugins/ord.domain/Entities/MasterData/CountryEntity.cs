using Ord.Plugin.Contract.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace Ord.Domain.Entities.MasterData
{
    [Table("system_countries")]
    public class CountryEntity : FullAuditedEntity<int>, IHasActived
    {
        [MaxLength(20)]
        public string? Code { get; set; }
        [MaxLength(200)]
        public string? Name { get; set; }
        [MaxLength(50)]
        public string? PhoneCode { get; set; }
        [MaxLength(20)]
        public string? CurrencyCode { get; set; }
        [MaxLength(100)]
        public string? ImageUrl { get; set; }
        public bool IsActived { get; set; }
    }
}
