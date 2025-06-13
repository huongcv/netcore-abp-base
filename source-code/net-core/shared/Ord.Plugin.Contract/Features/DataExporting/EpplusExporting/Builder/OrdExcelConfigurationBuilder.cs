using OfficeOpenXml;

namespace Ord.Plugin.Contract.Features.DataExporting.EpplusExporting
{
    // <summary>
    /// Builder pattern để cấu hình export dễ dàng
    /// </summary>
    public class OrdExcelConfigurationBuilder
    {
        private readonly OrdExcelConfiguration _configuration = new();

        #region Worksheet Configuration

        /// <summary>
        /// Thiết lập tên worksheet
        /// </summary>
        public OrdExcelConfigurationBuilder WithWorksheetName(string name)
        {
            _configuration.WorksheetName = name;
            return this;
        }

        /// <summary>
        /// Thiết lập chiều cao mặc định của hàng
        /// </summary>
        public OrdExcelConfigurationBuilder WithDefaultRowHeight(double height)
        {
            _configuration.DefaultRowHeight = height;
            return this;
        }

        /// <summary>
        /// Thiết lập chiều rộng mặc định của cột
        /// </summary>
        public OrdExcelConfigurationBuilder WithDefaultColumnWidth(double width)
        {
            _configuration.DefaultColumnWidth = width;
            return this;
        }

        /// <summary>
        /// Thiết lập auto fit columns
        /// </summary>
        public OrdExcelConfigurationBuilder WithAutoFitColumns(bool autoFit = true, double minWidth = 8, double maxWidth = 50)
        {
            _configuration.AutoFitColumns = autoFit;
            _configuration.MinColumnWidth = minWidth;
            _configuration.MaxColumnWidth = maxWidth;
            return this;
        }

        #endregion

        #region Title Configuration

        /// <summary>
        /// Thiết lập tiêu đề đơn giản
        /// </summary>
        public OrdExcelConfigurationBuilder WithTitle(string title, int rowIndex = 2, double? rowHeight = 32)
        {
            _configuration.Title = new OrdExcelTitle
            {
                Text = title,
                RowIndex = rowIndex,
                RowHeight = rowHeight
            };
            return this;
        }

        /// <summary>
        /// Thiết lập tiêu đề với cấu hình chi tiết
        /// </summary>
        public OrdExcelConfigurationBuilder WithTitle(Action<OrdExcelTitleBuilder> titleBuilder)
        {
            var builder = new OrdExcelTitleBuilder();
            titleBuilder(builder);
            _configuration.Title = builder.Build();
            return this;
        }

        #endregion

        #region Header Configuration

        /// <summary>
        /// Thiết lập vị trí header
        /// </summary>
        public OrdExcelConfigurationBuilder WithHeaderRowIndex(int index)
        {
            _configuration.HeaderRowIndex = index;
            return this;
        }

        /// <summary>
        /// Thiết lập tên cột tùy chỉnh
        /// </summary>
        public OrdExcelConfigurationBuilder WithCustomColumnNames(params string[] columnNames)
        {
            _configuration.CustomColumnNames = columnNames.ToList();
            return this;
        }

        /// <summary>
        /// Thiết lập style cho header
        /// </summary>
        public OrdExcelConfigurationBuilder WithHeaderStyle(Action<OrdExcelStyleBuilder> styleBuilder)
        {
            var builder = new OrdExcelStyleBuilder();
            styleBuilder(builder);
            _configuration.HeaderStyle = builder.Build();
            return this;
        }

        /// <summary>
        /// Thiết lập style header mặc định
        /// </summary>
        public OrdExcelConfigurationBuilder WithDefaultHeaderStyle()
        {
            _configuration.HeaderStyle = OrdExcelStyleConfiguration.Header();
            return this;
        }

        #endregion

        #region Data Configuration

        /// <summary>
        /// Thiết lập style cho data cells
        /// </summary>
        public OrdExcelConfigurationBuilder WithDataStyle(Action<OrdExcelStyleBuilder> styleBuilder)
        {
            var builder = new OrdExcelStyleBuilder();
            styleBuilder(builder);
            _configuration.DataStyle = builder.Build();
            return this;
        }

        #endregion

        #region Print Configuration

        /// <summary>
        /// Thiết lập cấu hình in ấn
        /// </summary>
        public OrdExcelConfigurationBuilder WithPrintSettings(Action<OrdExcelPrintBuilder> printBuilder)
        {
            var builder = new OrdExcelPrintBuilder();
            printBuilder(builder);
            _configuration.PrintSettings = builder.Build();
            return this;
        }

        /// <summary>
        /// Thiết lập hướng in landscape
        /// </summary>
        public OrdExcelConfigurationBuilder WithLandscapeOrientation()
        {
            _configuration.PrintSettings.Orientation = eOrientation.Landscape;
            return this;
        }

        /// <summary>
        /// Thiết lập hướng in portrait
        /// </summary>
        public OrdExcelConfigurationBuilder WithPortraitOrientation()
        {
            _configuration.PrintSettings.Orientation = eOrientation.Portrait;
            return this;
        }

        #endregion

        #region Advanced Configuration

        /// <summary>
        /// Thiết lập function tùy chỉnh worksheet
        /// </summary>
        public OrdExcelConfigurationBuilder WithCustomWorksheet(Action<ExcelWorksheet> customAction)
        {
            _configuration.CustomWorksheetAction = customAction;
            return this;
        }

        /// <summary>
        /// Thiết lập function tùy chỉnh worksheet async
        /// </summary>
        public OrdExcelConfigurationBuilder WithCustomWorksheetAsync(Func<ExcelWorksheet, Task> customAction)
        {
            _configuration.CustomWorksheetAsyncAction = customAction;
            return this;
        }

        /// <summary>
        /// Thiết lập bảo vệ worksheet
        /// </summary>
        public OrdExcelConfigurationBuilder WithProtection(string? password = null)
        {
            _configuration.ProtectWorksheet = true;
            _configuration.WorksheetPassword = password;
            return this;
        }

        #endregion

        /// <summary>
        /// Build configuration
        /// </summary>
        public OrdExcelConfiguration Build() => _configuration;

        /// <summary>
        /// Build action delegate
        /// </summary>
        public Action<OrdExcelConfiguration> BuildAction() => config =>
        {
            // Copy all properties from built configuration to the provided one
            typeof(OrdExcelConfiguration).GetProperties()
                .Where(p => p.CanWrite)
                .ToList()
                .ForEach(p => p.SetValue(config, p.GetValue(_configuration)));
        };
    }
}
