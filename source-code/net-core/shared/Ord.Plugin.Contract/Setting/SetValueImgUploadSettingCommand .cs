using MediatR;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Enums;

namespace Ord.Plugin.Contract.Setting
{
    public class SetValueImgUploadSettingCommand : IRequest<Guid>
    {
        public Guid fileCacheId { get; set; }
        public string? FileIdAssFromValue { get; set; }
    }
}
