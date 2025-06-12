namespace Ord.Plugin.Contract.Features.Notifications
{
    public enum NotificationSeverity : byte
    {
        /// <summary>Info.</summary>
        Info = 1,
        /// <summary>Success.</summary>
        Success = 2,
        /// <summary>Warn.</summary>
        Warn = 3,
        /// <summary>Error.</summary>
        Error = 4,
        /// <summary>Fatal.</summary>
        Fatal = 5,
    }
    public enum NotificationChannel
    {
        Firebase,
        SocketIo,
        Sms,
        Email,
        InApp
    }
}
