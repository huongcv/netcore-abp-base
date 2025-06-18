using FlexCel.XlsAdapter;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using Ord.Plugin.Contract.Consts;
using Ord.Plugin.Contract.Features.BlobStoring;
using Ord.Plugin.Contract.Features.DataImporting;
using Ord.Plugin.Contract.Features.Validation;
using Ord.Plugin.Core.Base;
using Volo.Abp.Validation;

namespace Ord.Plugin.Core.Features.DataImporting
{
    /// <summary>
    /// Lớp cha trừu tượng phục vụ import dữ liệu từ Excel
    /// </summary>
    /// <typeparam name="TImportDto">Kiểu dữ liệu DTO dùng để import</typeparam>
    public abstract class ExcelImportService<TImportDto> : OrdManagerBase, IExcelImportService<TImportDto>
        where TImportDto : class, IImportDto, new()
    {
        #region Abstract Methods - Phải được cài đặt bởi lớp con

        protected abstract Task PrepareDataForValidationAsync(List<TImportDto> rawDataList);

        /// <summary>
        /// Hàm kiểm tra logic nghiệp vụ cho mỗi dòng import
        /// </summary>
        protected abstract Task<List<string>> ValidateBusinessRulesForRowAsync(TImportDto importDto);

        protected abstract string GetFilePathExportResult();
        // vị trí dòng data trong file excel mẫu
        protected abstract int GetRowIndexStartExcelResult();
        protected abstract Task<List<object>> GetDataCellExcelResultAsync(TImportDto item);
        // tạo danh sách dữ liệu mẫu
        protected abstract Task<List<TImportDto>> GetSampleDataOfTemplateImport();

        #endregion

        /// <summary>
        /// Số dòng tối đa cho phép xử lý
        /// </summary>
        protected virtual int GetMaxRowsToProcess()
        {
            return AppConsts.MaxRowImportExcel; // Higher limit for pure reading
        }

        /// <summary>
        /// Xử lý kiểm tra dữ liệu và tách dữ liệu thành danh sách hợp lệ/lỗi
        /// </summary>
        public async Task<ImportOutputDto<TImportDto>> ValidateProcessDataAsync(List<TImportDto> rawDataList)
        {
            if (rawDataList?.Any() != true)
            {
                throw new AbpValidationException(AppFactory.GetLocalizedMessage(PrefixMessage() + "notDataImport"));
            }

            if (rawDataList.Count > GetMaxRowsToProcess())
            {
                throw new AbpValidationException(AppFactory.GetLocalizedMessage(PrefixMessage() + "veryManyData", GetMaxRowsToProcess().ToString()));
            }

            await PrepareDataForValidationAsync(rawDataList);
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
                var businessRuleErrors = await ValidateBusinessRulesForRowAsync(item);
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
        /// Xuất file excel các kết quả validate
        /// </summary>
        /// <param name="rawDataList"></param>
        /// <returns></returns>
        public async Task<byte[]> ExportResultDataAsync(List<TImportDto> rawDataList, Func<XlsFile, Task> funResultXls = null)
        {
            var filePath = GetFilePathExportResult();
            FlexCelService.SetTemplateProvider(TemplateProvider.FileSystem);
            var rowIndex = GetRowIndexStartExcelResult();
            return await FlexCelService.ExportExcelAsync(filePath, fileHandler: async resultXls =>
            {
                if (rawDataList?.Any() == true)
                {
                    foreach (var item in rawDataList)
                    {
                        var colIxd = 0;
                        resultXls.SetCellValue(rowIndex, ++colIxd, rowIndex - 1);
                        var cellDatas = await GetDataCellExcelResultAsync(item);
                        if (cellDatas?.Any() == true)
                        {
                            foreach (var cellData in cellDatas)
                            {
                                resultXls.SetCellValue(rowIndex, ++colIxd, cellData);
                            }
                        }
                        if (!item.IsSuccessData)
                        {
                            var errorValue = string.Join(Environment.NewLine, item?.ErrorMessages?.Select(x => $@"- {x}").ToList());
                            resultXls.SetCellValue(rowIndex, ++colIxd, errorValue);
                        }
                        rowIndex++;
                    }

                    if (funResultXls != null)
                    {
                        await funResultXls(resultXls);
                    }
                }
            });
        }

        public async Task<byte[]> ExportSampleTemplateExcel(Func<XlsFile, Task> funResultXls = null)
        {
            var dataSamples = await GetSampleDataOfTemplateImport();
            return await ExportResultDataAsync(dataSamples, funResultXls);
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
            var validationResults = DataAnnotationsValidator.ValidateObject(AppFactory.GetServiceDependency<IServiceProvider>(), dto, true);
            return validationResults.Select(vr => vr.ErrorMessage ?? "Validation error").ToList();
        }
    }
}
