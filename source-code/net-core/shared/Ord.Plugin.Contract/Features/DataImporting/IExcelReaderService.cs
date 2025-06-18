using Microsoft.AspNetCore.Http;

namespace Ord.Plugin.Contract.Features.DataImporting
{
    public interface IExcelReaderService<TDto>
        where TDto : IImportDto, new()
    {
        Task<List<TDto>> ReadFromExcelAsync(IFormFile file);
        Task<List<TDto>> ReadFromExcelAsync(byte[] fileBytes);
    }
}
