using Microsoft.AspNetCore.Mvc;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Core.Utils;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Core.Services
{
    public abstract partial class OrdCrudAppService<TEntity, TKey, TGetPagedInputDto, TGetPagedItemDto, TGetByIdDto, TCreateInputDto, TUpdateInputDto>
    {
        #region Read Operations

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

        #endregion

        #region Read Hook Methods

        /// <summary>
        /// Hook method sau khi lấy by id thành công
        /// Mục đích nếu cần thêm thông tin ngoài có thể lấy tại đây
        /// </summary>
        protected virtual Task OnAfterGetDetailAsync(TGetByIdDto dto)
        {
            return Task.CompletedTask;
        }

        #endregion
    }
}