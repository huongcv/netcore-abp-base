using AutoMapper;
using Ord.Domain.Entities.MasterData;

namespace Ord.Plugin.MasterData.Shared.Dtos
{
    public class DtoMapProfile : Profile
    {
        public DtoMapProfile()
        {
            CreateMap<CountryPagedDto, CountryEntity>().ReverseMap();
            CreateMap<CountryDetailDto, CountryEntity>().ReverseMap();
            CreateMap<CreateCountryDto, CountryEntity>().ReverseMap();
            CreateMap<UpdateCountryDto, CountryEntity>().ReverseMap();

        }
    }
}
