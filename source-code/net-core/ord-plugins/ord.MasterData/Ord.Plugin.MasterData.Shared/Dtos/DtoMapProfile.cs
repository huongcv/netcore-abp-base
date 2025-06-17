using AutoMapper;
using Ord.Contract.Entities;

namespace Ord.Plugin.MasterData.Shared.Dtos
{
    public class DtoMapProfile : Profile
    {
        public DtoMapProfile()
        {
            CreateMap<CountryPagedDto, UserEntity>().ReverseMap();
            CreateMap<CountryDetailDto, UserEntity>().ReverseMap();
            CreateMap<CreateCountryDto, UserEntity>().ReverseMap();
            CreateMap<UpdateCountryDto, UserEntity>().ReverseMap();

        }
    }
}
