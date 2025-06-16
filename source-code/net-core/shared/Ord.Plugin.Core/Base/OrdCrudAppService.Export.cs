using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Ord.Plugin.Contract.Features.DataExporting.EpplusExporting;
using Volo.Abp;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Core.Services
{
    public abstract partial class OrdCrudAppService<TEntity, TKey, TGetPagedInputDto, TGetPagedItemDto, TGetByIdDto, TCreateInputDto, TUpdateInputDto>
    {
        #region Export Operations

        /// <summary>
        /// Xuất dữ liệu phân trang ra Excel
        /// </summary>
        [HttpPost]
        [ActionName("ExportToExcel")]
        public virtual async Task<IActionResult> ExportToExcelAsync(TGetPagedInputDto input)
        {
            // Kiểm tra quyền export (có thể custom)
            await CheckExportPermissionAsync();

            try
            {
                input.MaxResultCount = Int32.MaxValue;
                var pagedResultCommon = await GetPaged(input);

                // Xuất dữ liệu
                var excelBytes = await GenerateExcelFileAsync(pagedResultCommon.Data, input);
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

        /// <summary>
        /// Tạo file Excel từ dữ liệu phân trang
        /// </summary>
        protected virtual async Task<byte[]> GenerateExcelFileAsync(PagedResultDto<TGetPagedItemDto> pagedResult, TGetPagedInputDto input)
        {
            var items = pagedResult?.Items ?? new List<TGetPagedItemDto>();

            // Lấy cấu hình export
            var config = new EpplusExportingConfigurationBuilder();
            await ConfigureExportAsync(config, items.ToList(), input);

            // Xuất dữ liệu
            return await EpplusService.ExportDataCollection(items, config.Build());
        }

        /// <summary>
        /// Kiểm tra quyền export
        /// </summary>
        protected virtual async Task CheckExportPermissionAsync()
        {
            // Mặc định sử dụng quyền Read, có thể override để dùng permission riêng
            await CheckPermissionForOperation(CrudOperationType.Read);
        }

        /// <summary>
        /// Cấu hình export Excel - override để custom
        /// </summary>
        protected virtual async Task ConfigureExportAsync(EpplusExportingConfigurationBuilder config, List<TGetPagedItemDto> dataItems, TGetPagedInputDto input)
        {
            // Override method này để cấu hình export theo từng entity
            await Task.CompletedTask;
        }

        /// <summary>
        /// Tạo tên file export
        /// </summary>
        protected virtual string GetExportFileName(TGetPagedInputDto input)
        {
            var entityName = AppFactory.GetLocalizedMessage("file.download-name." + typeof(TEntity).Name);
            return FileNameHelper.GenerateFileNameExcelWithTimestamp(entityName);
        }

        #endregion
    }
}