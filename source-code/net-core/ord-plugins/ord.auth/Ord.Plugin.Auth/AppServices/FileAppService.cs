using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration.UserSecrets;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.BlobStoring;
using Ord.Plugin.Contract.Utils;
using Ord.Plugin.Core.Base;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Validation;

namespace Ord.Plugin.Auth.AppServices
{
    [OrdAuth]
    public class FileAppService : OrdAppServiceBase
    {
        private IUploadFileManager UploadFileManager => AppFactory.GetServiceDependency<IUploadFileManager>();
        protected override string GetBasePermissionName()
        {
            return "UploadFile";
        }
        [HttpPost]
        public async Task<CommonResultDto<List<FileUploadDto>>> UploadImageAsync([FromForm] IEnumerable<IFormFile> files)
        {
            var fileDtos = new List<FileUploadDto>();
            foreach (var file in files)
            {
                var uploadDto = await UploadFileManager.UploadFileAsync(FileStoreProvider.MinIO, file, "Upload/Images");
                fileDtos.Add(uploadDto);
            }

            return AppFactory.CreateSuccessResult(fileDtos);
        }
        [HttpGet("GetFileById/{id}")]
        public async Task<IActionResult> GetFileByIdAsync(Guid id)
        {
            var fileDto = await UploadFileManager.GetByFileIdAsync(id);
            if (fileDto == null || fileDto.BlobStream == null)
            {
                throw new EntityNotFoundException("fileNotExists");
            }
            var stream = fileDto.BlobStream;
            return new FileStreamResult(stream, fileDto.FileName.GetMimeType())
            {
                FileDownloadName = fileDto?.FileName
            };
        }

    }
}
