using Microsoft.AspNetCore.Mvc;
using Ord.Plugin.Contract.Base;
using Ord.Plugin.Contract.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Validation;

namespace Ord.Plugin.Core.Services
{
    public abstract partial class OrdCrudAppService<TEntity, TKey, TGetPagedInputDto, TGetPagedItemDto, TGetByIdDto, TCreateInputDto, TUpdateInputDto>
    {
        #region Modify Operations

        /// <summary>
        /// Tạo mới entity
        /// </summary>
        [HttpPost]
        [ActionName("Create")]
        public virtual async Task<CommonResultDto<TGetByIdDto>> CreateAsync(TCreateInputDto input)
        {
            await CheckPermissionForOperation(CrudOperationType.Create);

            var createdEntity = await CrudRepository.CreateAsync(input);
            var dto = AppFactory.ObjectMap<TEntity, TGetByIdDto>(createdEntity);

            // Set encoded ID nếu DTO support
            if (dto is IHasEncodedId encodedDto && dto is IEntityDto<TKey> entityDto)
            {
                encodedDto.EncodedId = IdEncoderService.EncodeId(entityDto.Id);
            }

            await OnAfterCreateAsync(createdEntity, dto);
            return AppFactory.CreateSuccessResult(dto, GetCreateSuccessMessage());
        }

        /// <summary>
        /// Cập nhật entity
        /// </summary>
        [HttpPost]
        [ActionName("Update")]
        public virtual async Task<CommonResultDto<TGetByIdDto>> UpdateAsync(TUpdateInputDto input)
        {
            await CheckPermissionForOperation(CrudOperationType.Update);

            var updatedEntity = await CrudRepository.UpdateByEncodedIdAsync(input.EncodedId, input);
            if (updatedEntity == null)
            {
                return AppFactory.CreateNotFoundResult<TGetByIdDto>(GetNotFoundMessage());
            }

            var dto = AppFactory.ObjectMap<TEntity, TGetByIdDto>(updatedEntity);

            // Set encoded ID nếu DTO support
            if (dto is IHasEncodedId encodedDto)
            {
                encodedDto.EncodedId = input.EncodedId;
            }

            await OnAfterUpdateAsync(updatedEntity, dto);
            return AppFactory.CreateSuccessResult(dto, GetUpdateSuccessMessage());
        }

        /// <summary>
        /// Xóa entity
        /// </summary>
        [HttpPost]
        [ActionName("Remove")]
        public virtual async Task<CommonResultDto<bool>> RemoveAsync(EncodedIdDto input)
        {
            await CheckPermissionForOperation(CrudOperationType.Delete);

            var result = await CrudRepository.DeleteByEncodedIdAsync(input.EncodedId);
            if (!result)
            {
                return AppFactory.CreateNotFoundResult<bool>(GetNotFoundMessage());
            }

            await OnAfterDeleteAsync(input.EncodedId);
            return AppFactory.CreateSuccessResult(result, GetDeleteSuccessMessage());
        }

        /// <summary>
        /// Cập nhật trạng thái Active/Inactive
        /// </summary>
        [HttpPost]
        [ActionName("SetActiveStatus")]
        public async Task<CommonResultDto<bool>> SetActiveStatusAsync(SetActiveStatusDto input)
        {
            if (!typeof(IHasActived).IsAssignableFrom(typeof(TEntity)))
            {
                throw new AbpValidationException("messages.not_support");
            }

            await CheckPermissionForOperation(CrudOperationType.Update);
            var id = ConvertEncodeId(input.EncodedId);
            var entity = await CrudRepository.GetByIdAsync(id);
            if (entity == null)
            {
                return AppFactory.CreateNotFoundResult<bool>(GetNotFoundMessage());
            }

            if (entity is IHasActived entityActive)
            {
                entityActive.IsActived = input.IsActived;
                await CrudRepository.UpdateAsync(entity);
            }

            return AppFactory.CreateSuccessResult(true, "messages.crud.set_active_status_success");
        }

        #endregion

        #region Modify Hook Methods

        /// <summary>
        /// Hook method sau khi tạo mới thành công
        /// </summary>
        protected virtual Task OnAfterCreateAsync(TEntity entity, TGetByIdDto dto)
        {
            return Task.CompletedTask;
        }

        /// <summary>
        /// Hook method sau khi cập nhật thành công
        /// </summary>
        protected virtual Task OnAfterUpdateAsync(TEntity entity, TGetByIdDto dto)
        {
            return Task.CompletedTask;
        }

        /// <summary>
        /// Hook method sau khi xóa thành công
        /// </summary>
        protected virtual Task OnAfterDeleteAsync(string encodedId)
        {
            return Task.CompletedTask;
        }

        #endregion
    }
}