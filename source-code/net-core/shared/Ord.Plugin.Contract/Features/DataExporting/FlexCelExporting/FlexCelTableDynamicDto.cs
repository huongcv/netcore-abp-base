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
    }
}
