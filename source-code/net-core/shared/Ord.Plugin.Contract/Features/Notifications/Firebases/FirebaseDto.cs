namespace Ord.Plugin.Core.Features.Notifications.Firebases
{
    public class FirebaseMessage
    {
        public string Title { get; set; }
        public string Body { get; set; }
        public string? ImageUrl { get; set; }
        public Dictionary<string, string>? Data { get; set; }
        public string Priority { get; set; } = "normal"; // normal, high
        public FirebaseAndroidConfig? AndroidConfig { get; set; }
        public FirebaseApnsConfig? ApnsConfig { get; set; }
    }

    public class FirebaseAndroidConfig
    {
        public string? Icon { get; set; }
        public string? Color { get; set; }
        public string? Sound { get; set; } = "default";
        public string? ChannelId { get; set; }
    }

    public class FirebaseApnsConfig
    {
        public string? Sound { get; set; } = "default";
        public int? Badge { get; set; }
    }
    public class FirebaseSendResult
    {
        public bool IsSuccess { get; set; }
        public string? MessageId { get; set; }
        public string? ErrorMessage { get; set; }
        public bool ShouldRetry { get; set; }
        public string? ErrorCode { get; set; }

        public static FirebaseSendResult Success(string messageId)
        {
            return new FirebaseSendResult { IsSuccess = true, MessageId = messageId };
        }

        public static FirebaseSendResult Failed(string error, bool shouldRetry = false, string? errorCode = null)
        {
            return new FirebaseSendResult
            {
                IsSuccess = false,
                ErrorMessage = error,
                ShouldRetry = shouldRetry,
                ErrorCode = errorCode
            };
        }
    }

    public class FirebaseBatchResult
    {
        public int TotalCount { get; set; }
        public int SuccessCount { get; set; }
        public int FailureCount { get; set; }
        public Dictionary<string, string> FailedTokens { get; set; } = new();

        public double SuccessRate => TotalCount > 0 ? (double)SuccessCount / TotalCount * 100 : 0;
    }
}
