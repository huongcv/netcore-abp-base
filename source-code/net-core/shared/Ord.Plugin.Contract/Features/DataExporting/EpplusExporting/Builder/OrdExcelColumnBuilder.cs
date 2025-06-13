using OfficeOpenXml.Style;
using System.Drawing;
using System.Linq.Expressions;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Localization;

namespace Ord.Plugin.Contract.Features.DataExporting.EpplusExporting
{
    /// <summary>
    /// Fluent column builder được tối ưu hóa
    /// </summary>
    public class OrdExcelColumnBuilder<T>
    {
        private readonly List<OrdExcelColumnData<T>> _columns = new();
        private readonly IAppFactory _appFactory;

        public OrdExcelColumnBuilder(IAppFactory appFactory)
        {
            _appFactory = appFactory;
        }

        /// <summary>
        /// Thêm cột số thứ tự
        /// </summary>
        public OrdExcelColumnBuilder<T> AddRowIndex(string headerName = "STT", double? width = 5)
        {
            _columns.Add(OrdExcelColumnData<T>.RowIndex(headerName, width));
            return this;
        }
        /// <summary>
        /// Thêm cột đơn giản
        /// </summary>
        public OrdExcelColumnBuilder<T> AddColumn<TProperty>(
            Expression<Func<T, TProperty>> expression,
            double width = 10)
        {
            _columns.Add(OrdExcelColumnData<T>.Create(expression, width: width));
            return this;
        }
        /// <summary>
        /// Thêm cột đơn giản
        /// </summary>
        public OrdExcelColumnBuilder<T> AddColumn<TProperty>(
            Expression<Func<T, TProperty>> expression,
            string? headerName = null,
            double? width = null)
        {
            _columns.Add(OrdExcelColumnData<T>.Create(expression, headerName, width));
            return this;
        }

        /// <summary>
        /// Thêm cột với style configuration
        /// </summary>
        public OrdExcelColumnBuilder<T> AddColumn<TProperty>(
            Expression<Func<T, TProperty>> expression,
            string? headerName,
            Action<OrdExcelStyleBuilder> styleBuilder,
            double? width = null)
        {
            var builder = new OrdExcelStyleBuilder();
            styleBuilder(builder);
            var style = builder.Build();

            _columns.Add(OrdExcelColumnData<T>.Create(expression, headerName, style, width));
            return this;
        }

        /// <summary>
        /// Thêm cột với custom style action
        /// </summary>
        public OrdExcelColumnBuilder<T> AddColumn<TProperty>(
            Expression<Func<T, TProperty>> expression,
            string? headerName,
            Action<T, ExcelStyle> customStyleAction,
            double? width = null)
        {
            var column = OrdExcelColumnData<T>.Create(expression, headerName, width);
            column.CustomStyleAction = customStyleAction;
            _columns.Add(column);
            return this;
        }

        /// <summary>
        /// Thêm cột currency
        /// </summary>
        public OrdExcelColumnBuilder<T> AddCurrencyColumn<TProperty>(
            Expression<Func<T, TProperty>> expression,
            string? headerName = null,
            string currencySymbol = "₫",
            double? width = null)
        {
            return AddColumn(expression, headerName, style =>
            {
                style.WithCurrencyFormat(currencySymbol);
            }, width);
        }

        /// <summary>
        /// Thêm cột date
        /// </summary>
        public OrdExcelColumnBuilder<T> AddDateColumn<TProperty>(
            Expression<Func<T, TProperty>> expression,
            string? headerName = null,
            string format = "dd/mm/yyyy",
            double? width = null)
        {
            return AddColumn(expression, headerName, style =>
            {
                style.WithDateFormat(format);
            }, width);
        }

        /// <summary>
        /// Thêm cột datetime
        /// </summary>
        public OrdExcelColumnBuilder<T> AddDateTimeColumn<TProperty>(
            Expression<Func<T, TProperty>> expression,
            string? headerName = null,
            string format = "dd/mm/yyyy hh:mm:ss",
            double? width = null)
        {
            return AddColumn(expression, headerName, style =>
            {
                style.WithDateTimeFormat(format);
            }, width);
        }

        /// <summary>
        /// Thêm cột percentage
        /// </summary>
        public OrdExcelColumnBuilder<T> AddPercentageColumn<TProperty>(
            Expression<Func<T, TProperty>> expression,
            string? headerName = null,
            int decimals = 2,
            double? width = null)
        {
            return AddColumn(expression, headerName, style =>
            {
                style.WithPercentageFormat(decimals);
            }, width);
        }

        /// <summary>
        /// Thêm cột với conditional formatting
        /// </summary>
        public OrdExcelColumnBuilder<T> AddConditionalColumn<TProperty>(
            Expression<Func<T, TProperty>> expression,
            string? headerName,
            Func<T, bool> condition,
            Color trueColor,
            Color falseColor,
            double? width = null)
        {
            return AddColumn(expression, headerName, (data, style) =>
            {
                var color = condition(data) ? trueColor : falseColor;
                style.Font.Color.SetColor(color);
            }, width);
        }
        public OrdExcelColumnBuilder<T> AddIsActiveColumn(
            Expression<Func<T, bool?>> expression,
            double? width = null,
            string? headerName = null
            )
        {
            return AddConditionalColumn(
                    x => expression.Compile().Invoke(x) == true ? _appFactory.GetLocalizedMessage("status.active") : _appFactory.GetLocalizedMessage("status.inactive"),
                    headerName ?? "Status",
                    u => expression.Compile().Invoke(u) == true,
                    Color.Green,
                    Color.Red,
                    12);
        }

        /// <summary>
        /// Thêm cột với conditional background
        /// </summary>
        public OrdExcelColumnBuilder<T> AddConditionalBackgroundColumn<TProperty>(
            Expression<Func<T, TProperty>> expression,
            string? headerName,
            Func<T, bool> condition,
            Color trueBackgroundColor,
            Color falseBackgroundColor,
            double? width = null)
        {
            return AddColumn(expression, headerName, (data, style) =>
            {
                var color = condition(data) ? trueBackgroundColor : falseBackgroundColor;
                style.Fill.PatternType = ExcelFillStyle.Solid;
                style.Fill.BackgroundColor.SetColor(color);
            }, width);
        }

        public OrdExcelColumnData<T>[] Build() => _columns.ToArray();
    }
}