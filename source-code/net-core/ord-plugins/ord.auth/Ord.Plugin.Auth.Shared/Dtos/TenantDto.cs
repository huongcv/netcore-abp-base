using Ord.Plugin.Contract.Base;
using Ord.Plugin.Core.Enums;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Auth.Shared.Dtos
{
    public class TenantDto : EntityDto<Guid?>,IHasActived
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public bool IsActived { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        /// <summary>
        /// La kho thuoc
        /// </summary>
        public bool IsStock { get; set; }
        public TenantType Type { get; set; }
    }

    //public class TenantDtoValidator : AbstractValidator<TenantDto>
    //{
    //    public TenantDtoValidator(ITenantDaoService dao)
    //    {
    //        RuleFor(x => x.Code).MustAsync(async (dto, ma, cancellation) =>
    //        {
    //            var findByMa = await dao.GetByCode(ma);
    //            return findByMa == null || findByMa.Id == dto.Id;
    //        }).WithMessage("duplicate_code");
    //    }
    //}
}
