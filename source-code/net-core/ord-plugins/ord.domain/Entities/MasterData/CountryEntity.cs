using Ord.Plugin.Contract.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace Ord.Domain.Entities.MasterData
{
    [Table("system_countries")]
    public class CountryEntity : FullAuditedEntity<int>, IHasActived
    {

        public const int MaxLengthCode = 20;
        public const int MaxLengthName = 200;
        public const int MaxLengthPhoneCode = 50;
        public const int MaxLengthCurrencyCode = 20;

        [MaxLength(MaxLengthCode)]
        public string? Code { get; set; }
        [MaxLength(MaxLengthName)]
        public string? Name { get; set; }
        [MaxLength(MaxLengthPhoneCode)]
        public string? PhoneCode { get; set; }
        [MaxLength(MaxLengthCurrencyCode)]
        public string? CurrencyCode { get; set; }
        [MaxLength(100)]
        public string? ImageUrl { get; set; }
        public bool IsActived { get; set; }
    }
}
