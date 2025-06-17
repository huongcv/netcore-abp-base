using AutoMapper;
using Ord.Domain.Entities.MasterData;
using Ord.Plugin.Contract.Base;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.Validation.Attributes;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.MasterData.Shared.Dtos
{
    public class DistrictMapProfile : Profile
    {
        public DistrictMapProfile()
        {
            CreateMap<DistrictPagedDto, DistrictEntity>().ReverseMap();
            CreateMap<DistrictDetailDto, DistrictEntity>().ReverseMap();
            CreateMap<CreateDistrictDto, DistrictEntity>().ReverseMap();
            CreateMap<UpdateDistrictDto, DistrictEntity>().ReverseMap();
        }
    }

    public class DistrictCrudBase : IHasActived, IHasEncodedId
    {
        [OrdMaxLengthString(DistrictEntity.MaxLengthProvinceCode)]
        [OrdValidateRequired]
        public string? ProvinceCode { get; set; }
        [OrdMaxLengthString(DistrictEntity.MaxLengthCode)]
        [OrdValidateRequired]
        public string? Code { get; set; }
        [OrdMaxLengthString(DistrictEntity.MaxLengthName)]
        [OrdValidateRequired]
        public string? Name { get; set; }
        [OrdMaxLengthString(DistrictEntity.MaxLengthLevel)]
        public string? Level { get; set; }
        
        public bool IsActived { get; set; }
        public virtual string? EncodedId { get; set; }
    }
    public class DistrictPagedDto : DistrictCrudBase, IEntityDto<int>
    {
        public int Id { get; set; }
        public DateTime CreationTime { get; set; }
    }
    public class DistrictPagedInput : OrdPagedRequestDto
    {

    }
    public class DistrictDetailDto : DistrictCrudBase, IEntityDto<int>
    {
        public int Id { get; set; }
        public DateTime CreationTime { get; set; }
    }

    public class CreateDistrictDto : DistrictCrudBase
    {
    }

    public class UpdateDistrictDto : DistrictCrudBase
    {
    }
}