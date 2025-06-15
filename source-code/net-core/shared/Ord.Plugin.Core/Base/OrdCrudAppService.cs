using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Ord.Plugin.Contract.Base;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.DataExporting.EpplusExporting;
using Ord.Plugin.Contract.Services.Security;
using Ord.Plugin.Core.Base;
using Ord.Plugin.Core.Utils;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Validation;

namespace Ord.Plugin.Core.Services
{
    /// <summary>
    /// Base class cho các CRUD App Services
    /// </summary>
    /// <typeparam name="TEntity">Entity type</typeparam>
    /// <typeparam name="TKey">Primary key type</typeparam>
    /// <typeparam name="TGetPagedInputDto">Input DTO cho phân trang</typeparam>
    /// <typeparam name="TGetPagedItemDto">Item DTO cho danh sách phân trang</typeparam>
    /// <typeparam name="TGetByIdDto">DTO cho chi tiết entity</typeparam>
    /// <typeparam name="TCreateInputDto">DTO cho tạo mới</typeparam>
    /// <typeparam name="TUpdateInputDto">DTO cho cập nhật</typeparam>
    [OrdAuth]
    public abstract class OrdCrudAppService<TEntity, TKey, TGetPagedInputDto, TGetPagedItemDto, TGetByIdDto, TCreateInputDto, TUpdateInputDto>
        : OrdAppServiceBase
        where TEntity : class, IEntity<TKey>
        where TGetPagedInputDto : PagedAndSortedResultRequestDto
        where TGetPagedItemDto : class, IHasEncodedId, IEntityDto<TKey>
        where TGetByIdDto : class
        where TCreateInputDto : class
        where TUpdateInputDto : class, IHasEncodedId
    {
        #region Services & Repositories

        /// <summary>
        /// Repository chính cho CRUD operations
        /// </summary>
        protected abstract IOrdCrudRepository<TEntity, TKey, TGetPagedInputDto, TGetPagedItemDto, TGetByIdDto, TCreateInputDto, TUpdateInputDto> CrudRepository { get; }

        /// <summary>
        /// Id encoder service để encode/decode ID
        /// </summary>
        protected IIdEncoderService<TEntity, TKey> IdEncoderService =>
            AppFactory.GetServiceDependency<IIdEncoderService<TEntity, TKey>>();

        #endregion

        #region CRUD Operations

        /// <summary>
        /// Lấy danh sách phân trang
        /// </summary>
        [HttpPost]
        [ActionName("GetPaged")]
        public virtual async Task<CommonResultDto<PagedResultDto<TGetPagedItemDto>>> GetPaged(TGetPagedInputDto input)
        {
            await CheckPermissionForOperation(CrudOperationType.GetPaged);
            var paged = await CrudRepository.GetPagedListAsync(input);
            AppFactory.EncodeIdPagedItems<TEntity, TKey, TGetPagedItemDto>(paged.Items);
            return AppFactory.CreateSuccessResult(paged);
        }


        /// <summary>
        /// Lấy số lượng theo trạng thái IsActived
        /// </summary>
        [HttpPost]
        [ActionName("GetCountByActive")]
        public virtual async Task<CommonResultDto<CounterByIsActivedDto>> GetCountByIsActived(TGetPagedInputDto input)
        {
            await CheckPermissionForOperation(CrudOperationType.GetPaged);
            var counter = await CrudRepository.GetCountGroupByIsActivedAsync(input);
            return AppFactory.CreateSuccessResult(counter);
        }

        /// <summary>
        /// Lấy chi tiết theo ID đã encode
        /// </summary>
        [HttpPost]
        [ActionName("GetById")]
        public virtual async Task<CommonResultDto<TGetByIdDto>> GetById(EncodedIdDto input)
        {
            await CheckPermissionForOperation(CrudOperationType.GetDetail);
            var dto = await CrudRepository.GetDetailByEncodedIdAsync(input.EncodedId);
            if (dto == null)
            {
                return AppFactory.CreateNotFoundResult<TGetByIdDto>(GetNotFoundMessage());
            }
            await OnAfterGetDetailAsync(dto);
            return AppFactory.CreateSuccessResult(dto);
        }

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

        #region Export Operations
        /// <summary>
        /// Xuất dữ liệu phân trang ra Excel
        /// </summary>
        [HttpPost]
        public virtual async Task<IActionResult> ExportPagedResultData(TGetPagedInputDto input)
        {
            // Kiểm tra quyền export (có thể custom)
            await CheckPermissionForExport();

            try
            {
                input.MaxResultCount = Int32.MaxValue;
                var pagedResultCommon = await GetPaged(input);
                var items = pagedResultCommon?.Data?.Items ?? new List<TGetPagedItemDto>();
                // Lấy cấu hình export
                var config = new EpplusExportingConfigurationBuilder();
                await ConfigureExportAsync(config, items.ToList(), input);
                // Xuất dữ liệu
                var excelBytes = await EpplusService.ExportDataCollection(items, config.Build());
                var fileName = GetExportFileName(input);
                // Trả về file
                return new FileContentResult(excelBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                {
                    FileDownloadName = fileName
                };
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Lỗi khi xuất dữ liệu cho {EntityType}", typeof(TEntity).Name);
                throw new UserFriendlyException("Xuất dữ liệu thất bại. Vui lòng thử lại.");
            }
        }

        protected virtual async Task CheckPermissionForExport()
        {
            // Mặc định sử dụng quyền Read, có thể override để dùng permission riêng
            await CheckPermissionForOperation(CrudOperationType.Read);
        }
        /// <summary>
        /// Lấy cấu hình export 
        /// </summary>
        protected virtual async Task ConfigureExportAsync(EpplusExportingConfigurationBuilder config, List<TGetPagedItemDto> dataItems, TGetPagedInputDto input)
        {

        }

        protected virtual string GetExportFileName(TGetPagedInputDto input)
        {
            var entityName = AppFactory.GetLocalizedMessage("file.download-name." + typeof(TEntity).Name);
            return FileNameHelper.GenerateFileNameExcelWithTimestamp(entityName);
        }

        #endregion

        protected override string GetBasePermissionName()
        {
            return typeof(TEntity).Name;
        }

        #region Helper Methods

        /// <summary>
        /// Convert encoded ID sang TKey
        /// </summary>
        protected TKey ConvertEncodeId(string encodedId)
        {
            return IdEncoderService.DecodeId(encodedId);
        }

        #endregion



        #region Virtual Hook Methods - Override nếu cần custom logic
        /// <summary>
        /// Hook method sau khi lấy by id thành công
        /// Mục đích nếu cần thêm thông tin ngoài có thể lấy tại đây
        /// </summary>
        protected virtual Task OnAfterGetDetailAsync(TGetByIdDto dto)
        {
            return Task.CompletedTask;
        }

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

    /// <summary>
    /// Enum định nghĩa các loại CRUD operations
    /// </summary>
    public enum CrudOperationType
    {
        Base,
        Create,
        Read,
        GetPaged,
        GetDetail,
        Update,
        Delete
    }
}