using Ord.Plugin.Contract.Exceptions;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Core.Services;
using Ord.Plugin.Core.Utils;
using Volo.Abp.Application.Services;

namespace Ord.Plugin.Core.Base
{
    public abstract class OrdAppServiceBase : ApplicationService
    {
        protected IAppFactory AppFactory => LazyServiceProvider.LazyGetRequiredService<IAppFactory>();
        protected IEpplusExportingExcelService EpplusService => LazyServiceProvider.LazyGetRequiredService<IEpplusExportingExcelService>();
        protected IFlexCelExportingService FlexCelService => LazyServiceProvider.LazyGetRequiredService<IFlexCelExportingService>();

        #region Permission Methods

        /// <summary>
        /// Kiểm tra quyền cho từng loại operation
        /// </summary>
        protected virtual async Task CheckPermissionForOperation(CrudOperationType operationType)
        {
            var permissionName = GetPermissionName(operationType);
            await EnsurePermissionAsync(permissionName);
        }
        protected virtual async Task CheckPermissionForActionName(string actionName)
        {
            var permissionName = GetPermissionName(CrudOperationType.Base) + "." + actionName;
            await EnsurePermissionAsync(permissionName);
        }

        protected virtual async Task EnsurePermissionAsync(string? permissionName)
        {
            if (!string.IsNullOrEmpty(permissionName))
            {
                var isGranted = await AppFactory.CheckPermissionAsync(permissionName);
                if (!isGranted)
                {
                    throw new NotAccessPermissionException();
                }
            }
        }

        /// <summary>
        /// Lấy tên permission theo loại operation
        /// Override để custom permission cho từng entity
        /// </summary>
        protected virtual string GetPermissionName(CrudOperationType operationType)
        {
            var baseName = GetBasePermissionName();
            return operationType switch
            {
                CrudOperationType.Base => $"{baseName}",
                CrudOperationType.Create => $"{baseName}.Create",
                CrudOperationType.Read => $"{baseName}.Read",
                CrudOperationType.GetPaged => $"{baseName}.GetPaged",
                CrudOperationType.GetDetail => $"{baseName}.GetDetail",
                CrudOperationType.Update => $"{baseName}.Update",
                CrudOperationType.Delete => $"{baseName}.Delete",
                _ => baseName
            };
        }

        /// <summary>
        /// Lấy base permission name - override trong derived class
        /// </summary>
        protected  abstract string GetBasePermissionName();

        #endregion

        #region Messages - Override để custom message

        protected virtual string GetMessagePrefix()
        {
            return "messages.crud.";
            // return typeof(TEntity).Name.ToLower();
        }
        protected virtual string GetNotFoundMessage()
        {
            return $"{GetMessagePrefix()}not_found";
        }

        protected virtual string GetCreateSuccessMessage()
        {
            return $"{GetMessagePrefix()}create_success";
        }

        protected virtual string GetUpdateSuccessMessage()
        {
            return $"{GetMessagePrefix()}update_success";
        }

        protected virtual string GetDeleteSuccessMessage()
        {
            return $"{GetMessagePrefix()}delete_success";
        }
        protected virtual string GetAccessDeniedMessage()
        {
            return $"{GetMessagePrefix()}access_denied";
        }
        #endregion
    }
}
