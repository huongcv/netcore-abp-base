using Ord.Plugin.Contract.Utils;
using System.Text.Json.Serialization;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Contract.Dtos
{
    public class OrdPagedRequestDto : PagedAndSortedResultRequestDto
    {
        private string? _filter;
        public virtual string? Filter
        {
            get => _filter;
            set => _filter = !string.IsNullOrEmpty(value) ? value.Trim() : value;
        }
        [JsonIgnore]
        public virtual string? TextSearch => Filter?.LikeTextSearch();
        public virtual bool? IsActived { get; set; }
    }

    public class OrdExportPaged
    {
        public string? Title { get; set; }
        public List<string> ColumnNames { get; set; }
        public Dictionary<string, string> OtherFields { get; set; }
    }

    public class OrdColumnFilter
    {
        public List<bool>? IsActived { get; set; }
    }
}
