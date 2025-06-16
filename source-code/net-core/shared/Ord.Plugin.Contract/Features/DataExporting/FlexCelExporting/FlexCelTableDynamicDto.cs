using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Utils;
using System.Linq.Expressions;

namespace Ord.Plugin.Contract.Features.DataExporting.FlexCelExporting
{
    public class FlexCelTableDynamicDto<TItemDto>
    {
        public IAppFactory AppFactory { get; }
        public List<TItemDto> DataItems { get; }

        public FlexCelTableDynamicDto(IAppFactory appFactory, IList<TItemDto> dataItems)
        {
            AppFactory = appFactory;
            DataItems = dataItems.ToList();
        }

        public Dictionary<string, Func<TItemDto, string?>> Columns { get; set; } = new();

        public FlexCelTableDynamicDto<TItemDto> AddColumn(string columnName, Expression<Func<TItemDto, string?>> expression)
        {
            columnName = AppFactory.GetLocalizedMessage(StringUtil.AddPrefixForFieldNameLocalized(columnName));
            if (!Columns.ContainsKey(columnName))
            {
                Columns.Add(columnName, expression.Compile());
            }
            return this;
        }
        public FlexCelTableDynamicDto<TItemDto> AddRowIndexColumn()
        {
            var columnName = StringUtil.AddPrefixForFieldNameLocalized("RowIndex");
            Columns.Add(AppFactory.GetLocalizedMessage(columnName), x => "");
            return this;
        }
        public FlexCelTableDynamicDto<TItemDto> AddColumn(string columnName, Expression<Func<TItemDto, DateTime?>> expression, string formatDateTime = "dd/MM/yyyy")
        {
            Columns.Add(columnName, x =>
            {
                var data = expression.Compile().Invoke(x);
                if (data.HasValue)
                {
                    return data.Value.ToString(formatDateTime);
                }

                return null;
            });
            return this;
        }
        public FlexCelTableDynamicDto<TItemDto> AddColumn(string columnName, Expression<Func<TItemDto, decimal?>> expression, string format = "#,##0.00")
        {
            columnName = AppFactory.GetLocalizedMessage(StringUtil.AddPrefixForFieldNameLocalized(columnName));
            if (!Columns.ContainsKey(columnName))
            {
                Columns.Add(columnName, x =>
                {
                    var data = expression.Compile().Invoke(x);
                    if (data.HasValue)
                    {
                        return data.Value.ToString(format);
                    }
                    return null;
                });
            }
            return this;
        }

        public FlexCelTableDynamicDto<TItemDto> AddColumn(string columnName, Expression<Func<TItemDto, int?>> expression)
        {
            columnName = AppFactory.GetLocalizedMessage(StringUtil.AddPrefixForFieldNameLocalized(columnName));
            if (!Columns.ContainsKey(columnName))
            {
                Columns.Add(columnName, x =>
                {
                    var data = expression.Compile().Invoke(x);
                    return data?.ToString();
                });
            }
            return this;
        }

        public FlexCelTableDynamicDto<TItemDto> AddColumn(string columnName, Expression<Func<TItemDto, bool?>> expression, string trueText = "Có", string falseText = "Không")
        {
            columnName = AppFactory.GetLocalizedMessage(StringUtil.AddPrefixForFieldNameLocalized(columnName));
            if (!Columns.ContainsKey(columnName))
            {
                Columns.Add(columnName, x =>
                {
                    var data = expression.Compile().Invoke(x);
                    if (data.HasValue)
                    {
                        return data.Value ? trueText : falseText;
                    }
                    return null;
                });
            }
            return this;
        }

        public FlexCelTableDynamicDto<TItemDto> AddColumnIsActive(Expression<Func<TItemDto, bool?>> expression,string columnName="Status")
        {
            return AddColumn(columnName, expression,
                AppFactory.GetLocalizedMessage("status.active"),
                AppFactory.GetLocalizedMessage("status.inactive")
            );
        }
    }
}
