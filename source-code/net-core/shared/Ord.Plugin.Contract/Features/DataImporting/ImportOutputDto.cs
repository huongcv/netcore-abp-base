namespace Ord.Plugin.Contract.Features.DataImporting
{
    public class ImportOutputDto<TImportDto>
    {
        public List<TImportDto>? ErrorImportList { get; set; }
        public List<TImportDto>? SuccessImportList { get; set; }
    }
    public interface IImportDto
    {
        int? RowNumber { get; set; }
        List<string>? ErrorMessages { get; set; }
        bool IsSuccessData => ErrorMessages?.Any() != true;
    }
    public class DownloadResultFileImport<TImportDto>
    {
        public List<TImportDto>? Items { get; set; }
        public bool IsSuccessList { get; set; }
    }
}
