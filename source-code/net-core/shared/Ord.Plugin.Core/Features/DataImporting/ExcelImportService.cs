using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Ord.Plugin.Contract.Features.DataImporting;
using Ord.Plugin.Core.Base;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Validation;

namespace Ord.Plugin.Core.Features.DataImporting
{
    /// <summary>
    /// Lớp cha trừu tượng phục vụ import dữ liệu từ Excel
    /// </summary>
    /// <typeparam name="TImportDto">Kiểu dữ liệu DTO dùng để import</typeparam>
    public abstract class ExcelImportService<TImportDto> : OrdManagerBase
        where TImportDto : class, IImportDto, new()
    {
        protected readonly ILogger Logger;

        /// <summary>
        /// Constructor nhận logger và validator tùy chọn
        /// </summary>
        protected ExcelImportService(ILogger logger)
        {
            Logger = logger;
        }

        #region Abstract Methods - Phải được cài đặt bởi lớp con

        /// <summary>
        /// Hàm kiểm tra logic nghiệp vụ cho mỗi dòng import
        /// </summary>
        protected abstract Task<List<string>> ValidateBusinessRulesAsync(TImportDto importDto);

        #endregion

        /// <summary>
        /// Số dòng tối đa cho phép xử lý
        /// </summary>
        protected virtual int GetMaxRowsToProcess()
        {
            return 2000; // Giới hạn mặc định
        }

        /// <summary>
        /// Xử lý kiểm tra dữ liệu và tách dữ liệu thành danh sách hợp lệ/lỗi
        /// </summary>
        public async Task<ImportOutputDto<TImportDto>> ValidateAndProcessDataAsync(List<TImportDto> rawDataList)
        {
            if (rawDataList?.Any() != true)
            {
                throw new AbpValidationException(AppFactory.GetLocalizedMessage(PrefixMessage() + "notDataImport"));
            }

            if (rawDataList.Count > GetMaxRowsToProcess())
            {
                throw new AbpValidationException(AppFactory.GetLocalizedMessage(PrefixMessage() + "veryManyData", GetMaxRowsToProcess().ToString()));
            }

            var successList = new List<TImportDto>();
            var errorList = new List<TImportDto>();
            var fluentValidator = ServiceProvider.GetService<IValidator<TImportDto>>();
            foreach (var item in rawDataList)
            {
                var validationErrors = new List<string>();

                //Kiểm tra bằng DataAnnotation
                var dataAnnotationErrors = ValidateDataAnnotations(item);
                validationErrors.AddRange(dataAnnotationErrors);

                //Kiểm tra bằng FluentValidation (nếu có)
                if (fluentValidator != null)
                {
                    var result = await fluentValidator.ValidateAsync(item);
                    if (!result.IsValid)
                    {
                        validationErrors.AddRange(result.Errors.Select(e => e.ErrorMessage));
                    }
                }

                //Kiểm tra nghiệp vụ
                var businessRuleErrors = await ValidateBusinessRulesAsync(item);
                validationErrors.AddRange(businessRuleErrors);

                // Gán lỗi vào property `ErrorMessages` nếu tồn tại
                SetValidationErrors(item, validationErrors);

                if (validationErrors.Count == 0)
                {
                    successList.Add(item);
                }
                else
                {
                    errorList.Add(item);
                }
            }

            return new ImportOutputDto<TImportDto>()
            {
                SuccessImportList = successList,
                ErrorImportList = errorList
            };
        }

        /// <summary>
        /// Prefix cho message (dùng để lấy đa ngôn ngữ)
        /// </summary>
        protected string PrefixMessage()
        {
            return "messages.import.";
        }

        /// <summary>
        /// Gán danh sách lỗi vào thuộc tính ErrorMessages nếu có
        /// </summary>
        private void SetValidationErrors(TImportDto dto, List<string> errors)
        {
            dto.ErrorMessages = errors.Select(it => AppFactory.GetLocalizedMessage(it)).ToList();
        }

        /// <summary>
        /// Kiểm tra các ràng buộc dữ liệu sử dụng Data Annotations
        /// </summary>
        private List<string> ValidateDataAnnotations(TImportDto dto)
        {
            var validationResults = new List<ValidationResult>();
            var validationContext = new ValidationContext(dto);

            Validator.TryValidateObject(dto, validationContext, validationResults, true);

            return validationResults.Select(vr => vr.ErrorMessage ?? "Validation error").ToList();
        }
    }
}
