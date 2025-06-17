using AutoMapper;
using Ord.Domain.Entities.MasterData;
using Ord.Plugin.Contract.Base;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.Validation.Attributes;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.MasterData.Shared.Dtos
{
    public class ProvinceMapProfile : Profile
    {
        public ProvinceMapProfile()
        {
            CreateMap<ProvincePagedDto, ProvinceEntity>().ReverseMap();
            CreateMap<ProvinceDetailDto, ProvinceEntity>().ReverseMap();
            CreateMap<CreateProvinceDto, ProvinceEntity>().ReverseMap();
            CreateMap<UpdateProvinceDto, ProvinceEntity>().ReverseMap();
        }
    }

    public class ProvinceCrudBase : IHasActived, IHasEncodedId
    {
        [OrdMaxLengthString(ProvinceEntity.MaxLengthCountryCode)]
        public string? CountryCode { get; set; }
        [OrdMaxLengthString(ProvinceEntity.MaxLengthCode)]
        [OrdValidateRequired]
        public string? Code { get; set; }
        [OrdMaxLengthString(ProvinceEntity.MaxLengthName)]
        [OrdValidateRequired]
        public string? Name { get; set; }
        [OrdMaxLengthString(ProvinceEntity.MaxLengthLevel)]
        public string? Level { get; set; }
        
        public bool IsActived { get; set; }
        public virtual string? EncodedId { get; set; }
    }
    public class ProvincePagedDto : ProvinceCrudBase, IEntityDto<int>
    {
        public int Id { get; set; }
        public DateTime CreationTime { get; set; }
    }
    public class ProvincePagedInput : OrdPagedRequestDto
    {

    }
    public class ProvinceDetailDto : ProvinceCrudBase, IEntityDto<int>
    {
        public int Id { get; set; }
        public DateTime CreationTime { get; set; }
    }

    public class CreateProvinceDto : ProvinceCrudBase
    {
    }

    public class UpdateProvinceDto : ProvinceCrudBase
    {
    }
}