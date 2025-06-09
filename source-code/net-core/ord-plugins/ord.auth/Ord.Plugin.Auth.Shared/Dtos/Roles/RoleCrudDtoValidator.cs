using Ord.Plugin.Auth.Shared.Localization;
using Ord.Plugin.Contract.Factories;

namespace Ord.Plugin.Auth.Shared.Dtos.Roles
{
    public class CreateRoleDtoValidator : LocalizedValidator<CreateRoleDto, OrdAuthResource>
    {
        public CreateRoleDtoValidator(IAppFactory appFactory) : base(appFactory)
        {
            ValidateRequiredString((u => u.Name, "crud_role_name_null"),
                    (u => u.Code, "crud_role_code_null"));
            ValidateMaxLength(
                (u => u.Code, 100, "crud_role_code_max_length"),
                (u => u.Name, 200, "crud_role_name_max_length"),
                (u => u.Description, 500, "crud_role_description_max_length")
            );
        }
    }
    public class UpdateRoleDtoValidator : LocalizedValidator<UpdateRoleDto, OrdAuthResource>
    {
        public UpdateRoleDtoValidator(IAppFactory appFactory) : base(appFactory)
        {
            ValidateRequiredString((u => u.Name, "crud_role_name_null"),
                (u => u.Code, "crud_role_code_null"));
            ValidateMaxLength(
                (u => u.Code, 100, "crud_role_code_max_length"),
                (u => u.Name, 200, "crud_role_name_max_length"),
                (u => u.Description, 500, "crud_role_description_max_length")
            );
        }
    }
}
