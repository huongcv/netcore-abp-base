using MediatR;
using Newtonsoft.Json.Linq;

namespace Ord.Plugin.Contract.Services.Notification;

public class SendNotificationCommand: IRequest<bool>
{
    public string DeviceTokenId { get; set; }
    public List<Guid>? ToListUserId { get; set; }
    public Guid? ToUserId { get; set; }

    /// <summary>
    /// Name lấy ở constant NotificationNameConst
    /// </summary>
    public string NotificationName { get; set; }
    public string? Title { get; set; } = string.Empty;
    public string? Body { get; set; }

    /// <summary>
    /// Data đi kèm thông báo 
    /// </summary>
    public Dictionary<string, string>? Data { get; set; }

    public SendNotificationCommand()
    {

    }
    public SendNotificationCommand(List<Guid>? toListUserId, string notificationName, string? title, string? body, Dictionary<string, string>? data)
    {
        ToListUserId = toListUserId;
        NotificationName = notificationName;
        Title = title;
        Body = body;
        Data = data;
    }
    public SendNotificationCommand(Guid? toUserId, string notificationName, string? title, string? body, Dictionary<string, string>? data)
    {
        ToUserId = toUserId;
        NotificationName = notificationName;
        Title = title;
        Body = body;
        Data = data;
    }
}