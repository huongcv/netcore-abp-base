using AutoMapper;
using Ord.Domain.Entities.MasterData;
using Ord.Plugin.MasterData.Shared.Dtos;

namespace Ord.Plugin.MasterData.Shared.Mapper
{
    public class AutoMapperDtoMapProfile : Profile
    {
        public AutoMapperDtoMapProfile()
        {
            CreateMap<CountryPagedDto, CountryEntity>().ReverseMap();
            CreateMap<CountryDetailDto, CountryEntity>().ReverseMap();
            CreateMap<CreateCountryDto, CountryEntity>().ReverseMap();
            CreateMap<UpdateCountryDto, CountryEntity>().ReverseMap();
            CreateMap<CountryPagedDto, CountryImportDto>().ReverseMap();
        }
    }
}
