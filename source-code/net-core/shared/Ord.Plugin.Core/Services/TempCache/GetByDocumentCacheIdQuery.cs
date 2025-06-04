using MediatR;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Core.Services.UploadFile;
using Volo.Abp.Caching;

namespace Ord.Plugin.Core.Services.TemplateCache
{
    public class GetByDocumentCacheIdQuery : IRequest<FileUploadDto>
    {
        public Guid DocumentCacheId { get; set; }
        public GetByDocumentCacheIdQuery(Guid documentCacheId)
        {
            DocumentCacheId = documentCacheId;
        }
        
        private class Handler : IRequestHandler<GetByDocumentCacheIdQuery, FileUploadDto>
        {
            private readonly IAppFactory _appFactory;

            public Handler(IAppFactory appFactory)
            {
                _appFactory = appFactory;
            }

            private IDistributedCache<FileUploadDto, Guid> FileUploadDto =>
             _appFactory.GetServiceDependency<IDistributedCache<FileUploadDto, Guid>>();
            public async Task<FileUploadDto> Handle(GetByDocumentCacheIdQuery request, CancellationToken cancellationToken)
            {
                return await FileUploadDto.GetAsync(request.DocumentCacheId);
            }
        }
    }
}
