using System.Linq.Expressions;

namespace Ord.Plugin.Contract.Features.DataExporting.FlexCelExporting
{
    public class FlexCelTableDynamicDto<TItemDto>
    {
        public Dictionary<string, Func<TItemDto, string?>> Columns { get; set; } = new();

        public FlexCelTableDynamicDto<TItemDto> AddColumn(string columnName, Expression<Func<TItemDto, string?>> expression)
        {
            if (!Columns.ContainsKey(columnName))
            {
                Columns.Add(columnName, expression.Compile());
            }
            return this;
        }
        public FlexCelTableDynamicDto<TItemDto> AddRowIndexColumn()
        {
            Columns.Add("RowIndex", x => "");
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
