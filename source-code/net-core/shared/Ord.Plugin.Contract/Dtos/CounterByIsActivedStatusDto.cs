using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ord.Plugin.Contract.Dtos
{
    public class CounterByIsActivedDto
    {
        public int TotalTrue => Items?.Count(x => x.IsActived == true) ?? 0;
        public int TotalFalse => Items?.Count(x => x.IsActived != true) ?? 0;
        public int Total => TotalFalse + TotalTrue;
        public IEnumerable<CounterByIsActivedItemDto> Items { get; set; }
    }

    public class CounterByIsActivedItemDto
    {
        public bool IsActived { get; set; }
        public int TotalCount { get; set; }
    }
}
