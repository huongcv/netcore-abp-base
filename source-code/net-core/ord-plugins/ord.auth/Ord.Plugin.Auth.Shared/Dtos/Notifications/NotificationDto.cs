using Ord.Contract.Dtos.CommonDto;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.Notifications;
using System.ComponentModel;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Auth.Shared.Dtos.Notifications
{
    public class UserNotificationDto : EntityDto<Guid>
    {
        public Guid NotificationId { get; set; }
        public string? NotificationName { get; set; }
        public string? Title { get; set; }
        public string? Body { get; set; }
        public string? DataJson { get; set; }
        public NotificationSeverity Severity { get; set; }
        public bool State { get; set; } // true = đã đọc
        public DateTime CreationTime { get; set; }
        public string? SeverityText => Severity.ToString();
        public bool IsRead => State;
    }

    public class GetUserNotificationInput : OrdPagedRequestDto
    {
        public bool? IsRead { get; set; }
        public NotificationSeverity? Severity { get; set; }
        public DateRangeDto? CreationTimeRange { get; set; }
        public DateTime? FromDate => CreationTimeRange?.StartDate;
        public DateTime? ToDate => CreationTimeRange?.EndDate;
    }

    public class SendNotificationDto
    {
        [DisplayName("field.notification_name")]
        public string? NotificationName { get; set; }

        [DisplayName("field.title")]
        public string? Title { get; set; }

        [DisplayName("field.body")]
        public string? Body { get; set; }

        public NotificationSeverity Severity { get; set; } = NotificationSeverity.Info;

        public Dictionary<string, object?>? Data { get; set; }

        /// <summary>
        /// Danh sách UserId cần gửi thông báo
        /// </summary>
        public List<Guid>? UserIds { get; set; }

        /// <summary>
        /// Kênh gửi thông báo
        /// </summary>
        public List<NotificationChannel> Channels { get; set; } = new() { NotificationChannel.InApp };
    }

    public class NotificationSummaryDto
    {
        public int TotalCount { get; set; }
        public int UnreadCount { get; set; }
        public int ReadCount { get; set; }
    }

    public class MarkNotificationAsReadDto
    {
        public List<Guid> NotificationIds { get; set; } = new();
    }
}
