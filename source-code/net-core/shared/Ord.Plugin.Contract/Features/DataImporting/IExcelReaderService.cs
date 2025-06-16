namespace Ord.Plugin.Contract.Features.DataImporting
{
   public interface IExcelReaderService<TDto>
       where TDto : class, IImportDto, new()
   {
       Task<List<TDto>> ReadFromExcelAsync(byte[] fileBytes, string fileName);
        Task<bool> ValidateExcelStructureAsync(byte[] fileBytes, string fileName);
   }
}
