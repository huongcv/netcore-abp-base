namespace Ord.Plugin.Contract.Dtos
{
    public class ComboOptionDto
    {
        public object? Value { get; set; }
        public string? DisplayName { get; set; }
        public object? Data { get; set; }
    }

    public class GetComboOptionInputDto
    {
        public bool? IncludeUnActive { get; set; }
    }
}
