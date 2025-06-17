using Ord.Domain.Entities.MasterData;
using Ord.Plugin.Contract.Base;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.Validation.Attributes;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.MasterData.Shared.Dtos
{
    public class CountryCrudBase : IHasActived, IHasEncodedId
    {
        [OrdMaxLengthString(CountryEntity.MaxLengthCode)]
        [OrdValidateRequired]
        public string? Code { get; set; }
        [OrdMaxLengthString(CountryEntity.MaxLengthName)]
        [OrdValidateRequired]
        public string? Name { get; set; }
        [OrdMaxLengthString(CountryEntity.MaxLengthPhoneCode)]
        public string? PhoneCode { get; set; }
        [OrdMaxLengthString(CountryEntity.MaxLengthCurrencyCode)]
        public string? CurrencyCode { get; set; }
        public bool IsActived { get; set; }
        public virtual string? EncodedId { get; set; }
    }
    public class CountryPagedDto : CountryCrudBase, IEntityDto<int>
    {
        public int Id { get; set; }
        public DateTime CreationTime { get; set; }
    }
    public class CountryPagedInput : OrdPagedRequestDto
    {

    }
    public class CountryDetailDto : CountryCrudBase, IEntityDto<int>
    {
        public int Id { get; set; }
        public DateTime CreationTime { get; set; }
    }

    public class CreateCountryDto : CountryCrudBase
    {
    }

    public class UpdateCountryDto : CountryCrudBase
    {
    }
}
