namespace Ord.Plugin.Contract.Dtos
{
    public class CounterByIsActivedDto
    {
        public int TotalTrue => Items?.Where(x => x.IsActived == true)?.Sum(x => x.TotalCount) ?? 0;
        public int TotalFalse => Items?.Where(x => x.IsActived != true)?.Sum(x => x.TotalCount) ?? 0;
        public int Total => TotalFalse + TotalTrue;
        public IEnumerable<CounterByIsActivedItemDto> Items { get; set; }
    }

    public class CounterByIsActivedItemDto
    {
        public bool IsActived { get; set; }
        public int TotalCount { get; set; }
    }

    public class CounterByStatusItemDto
    {
        public object? StatusValue { get; set; }
        public string StatusDescription { get; set; }
        public int TotalCount { get; set; }
        public bool IsTotalItem { get; set; }
    }
}
