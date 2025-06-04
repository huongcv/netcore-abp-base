using Volo.Abp;
using Volo.Abp.Auditing;
using Volo.Abp.Domain.Entities;

namespace Ord.Plugin.Contract.Base
{
    public interface IHasActived
    {
        bool IsActived { get; set; }
    }
    public class EntityActivedSoftDelete<TKey> : Entity<TKey>, IHasActived, ISoftDelete, IHasDeletionTime, IDeletionAuditedObject
    {
        public bool IsActived { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? DeletionTime { get; set; }
        public Guid? DeleterId { get; set; }
    }
}
