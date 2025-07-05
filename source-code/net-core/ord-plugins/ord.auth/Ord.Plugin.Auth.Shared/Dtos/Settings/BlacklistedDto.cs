using AutoMapper;
using FluentValidation;
using Ord.Domain.Entities.Auth;
using Ord.Plugin.Contract.Dtos;
using Volo.Abp.Domain.Entities;

namespace Ord.Plugin.Auth.Shared.Dtos.Settings
{
    [AutoMap(typeof(BlacklistedEntity), ReverseMap = true)]
    public class BlacklistedDto : Entity<int>, IHasEncodedId
    {
        public string? EncodedId { get; set; }
        public string? Name { get; set; }
        public string? Value { get; set; }
    }
    public class InsertBulkBlacklistedDto
    {
        public List<string>? Values { get; set; }
    }
    public class InsertBulkBlacklistedDtoValidator : AbstractValidator<InsertBulkBlacklistedDto>
    {
        public InsertBulkBlacklistedDtoValidator()
        {
            RuleForEach(x => x.Values)
                .MaximumLength(200)
                .WithMessage("Mỗi giá trị không được vượt quá 100 ký tự.");
        }
    }

    public class UpdateBlacklistedDto : IHasEncodedId
    {
        public string? Value { get; set; }
        public string? EncodedId { get; set; }
    }
}
