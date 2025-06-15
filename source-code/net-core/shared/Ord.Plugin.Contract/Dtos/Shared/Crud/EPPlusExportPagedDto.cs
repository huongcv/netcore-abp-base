using Ord.Plugin.Contract.Features.DataExporting.EpplusExporting;

namespace Ord.Plugin.Contract.Dtos
{
    public class EPPlusExportPagedDto<TGetPagedItemDto>
    {
        public Action<OrdExcelColumnBuilder<TGetPagedItemDto>> ColumnBuilder { get; set; }
        public Action<OrdExcelConfigurationBuilder> ConfigurationBuilder { get; set; }
        public string FileName { get; set; }

        public EPPlusExportPagedDto<TGetPagedItemDto> WithFileNameTimestamp(string fileNameWithoutExtension)
        {
            var timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");
            FileName = $"{fileNameWithoutExtension}_{timestamp}.xlsx";
            return this;
        }
    }
}
