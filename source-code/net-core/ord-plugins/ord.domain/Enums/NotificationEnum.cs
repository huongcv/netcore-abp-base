namespace Ord.Domain.Enums
{
    public enum NotificationSeverity
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
        Firebase = 1,
        SocketIo = 2,
        Sms = 3,
        Email = 4,
        InApp = 5
    }
}
