using Ord.Plugin.Contract.Base;
using Ord.Plugin.Contract.Dtos;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.MasterData.Shared.Dtos
{
    public class CountryCrudBase : IHasActived, IHasEncodedId
    {
        public string? Code { get; set; }
        public string? Name { get; set; }
        public string? PhoneCode { get; set; }
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
