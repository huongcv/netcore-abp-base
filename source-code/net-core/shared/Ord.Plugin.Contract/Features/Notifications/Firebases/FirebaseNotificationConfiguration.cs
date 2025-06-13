namespace Ord.Plugin.Core.Features.Notifications.Firebases
{
    public class FirebaseNotificationConfiguration
    {
        public const string SectionName = "Notification:Firebase";
        public string? ProjectId { get; set; }
        public string? ServiceAccountKeyPath { get; set; }
        public bool IsEnabled { get; set; } = true;
        public int BatchSize { get; set; } = 500;
        public int MaxRetryAttempts { get; set; } = 3;
        public int TimeoutSeconds { get; set; } = 30;
        public string DefaultPriority { get; set; } = "normal";
    }
}
