using FluentValidation;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Utils;

namespace Ord.Plugin.Auth.Shared.Dtos.Roles
{
    public class CreateRoleDtoValidator : AbstractValidator<CreateRoleDto>
    {
        public CreateRoleDtoValidator(IAppFactory appFactory)
        {
            RuleFor(u => u.Code).MaxLengthString(100).Required();
            RuleFor(u => u.Name).MaxLengthString(200).Required();
            RuleFor(u => u.Description).MaxLengthString(500);
        }
    }
    public class UpdateRoleDtoValidator : AbstractValidator<UpdateRoleDto>
    {
        public UpdateRoleDtoValidator(IAppFactory appFactory) 
        {
            RuleFor(u => u.Code).MaxLengthString(100).Required();
            RuleFor(u => u.Name).MaxLengthString(200).Required();
            RuleFor(u => u.Description).MaxLengthString(500);
        }
    }
}
