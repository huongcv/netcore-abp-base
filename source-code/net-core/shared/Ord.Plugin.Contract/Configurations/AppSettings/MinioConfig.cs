namespace Ord.Plugin.Contract.Configurations
{
    public class MinioOptions
    {
        public bool IsEnabled { get; set; }
        public string? EndPoint { get; set; }
        public string? AccessKey { get; set; }
        public string? SecretKey { get; set; }
        public string? BucketName { get; set; }
        public int TimeoutInSeconds { get; set; } = 30;
    }
}
