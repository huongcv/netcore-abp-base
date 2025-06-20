﻿using AutoMapper;
using Ord.Contract.Entities;
using Ord.Plugin.Auth.Shared.Dtos.Tenants;
using Ord.Plugin.Auth.Shared.Entities;

namespace Ord.Plugin.Auth.Shared.Dtos
{
    public class AuthMapProfile : Profile
    {
        public AuthMapProfile()
        {
            CreateMap<UserDto, UserEntity>().ReverseMap();
            CreateMap<UserPagedDto, UserEntity>().ReverseMap();
            CreateMap<UserDetailDto, UserEntity>().ReverseMap();
            CreateMap<CreateUserDto, UserEntity>().ReverseMap();
            CreateMap<UpdateUserDto, UserEntity>().ReverseMap();
            CreateMap<UserLoginDto, UserEntity>().ReverseMap();
            CreateMap<TenantUserDto, UserEntity>().ReverseMap();

            CreateMap<TenantPagedDto, TenantEntity>().ReverseMap();
            CreateMap<TenantDetailDto, TenantEntity>().ReverseMap();
            CreateMap<CreateTenantDto, TenantEntity>().ReverseMap();
            CreateMap<UpdateTenantDto, TenantEntity>().ReverseMap();


            CreateMap<RolePagedDto, RoleEntity>().ReverseMap();
            CreateMap<RoleDetailDto, RoleEntity>().ReverseMap();
            CreateMap<CreateRoleDto, RoleEntity>().ReverseMap();
            CreateMap<UpdateRoleDto, RoleEntity>().ReverseMap();

        }
    }
}
