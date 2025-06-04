using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace Ord.Plugin.Auth.Shared.Entities
{
    [Table(TableName)]
    public class UserFireBaseTokenEntity : CreationAuditedEntity<long>
    {
        public const string TableName = "system_userFirebaseToken";
        public virtual string FireBaseToken { get; set; }

        public virtual Guid UserId { get; set; }

        public virtual string Platform { get; set; }

        public virtual string? Version { get; set; }

    }
}
