using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Ord.Domain.Enums;
using Ord.Plugin.Contract.Features.Authorization.Users;
using Ord.Plugin.Contract.Features.Notifications;
using Ord.Plugin.Contract.Features.Notifications.Entities;
using Ord.Plugin.Core.Features.Notifications.Firebases;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;

namespace Ord.Plugin.Core.Features.Notifications.Channels
{
    public class FirebaseNotificationChannel : NotificationChannelBase
    {
        private readonly ILogger<FirebaseNotificationChannel> _logger;
        private readonly IFirebaseMessagingService _firebaseMessagingService;
        private readonly IOptions<FirebaseNotificationConfiguration> _config;
        private readonly IRepository<UserFirebaseDeviceEntity, Guid> _userFirebaseDeviceRepo;
        private readonly IDataFilter _dataFilter;

        public FirebaseNotificationChannel(
            ILogger<FirebaseNotificationChannel> logger,
            IFirebaseMessagingService firebaseMessagingService,
            IOptions<FirebaseNotificationConfiguration> config,
            IRepository<UserFirebaseDeviceEntity, Guid> userFirebaseDeviceRepo,
            IDataFilter dataFilter)
        {
            _logger = logger;
            _firebaseMessagingService = firebaseMessagingService;
            _config = config;
            _userFirebaseDeviceRepo = userFirebaseDeviceRepo;
            _dataFilter = dataFilter;
        }

        public override NotificationChannel ChannelType => NotificationChannel.Firebase;

        public override async Task SendAsync(UserIdentifier user, NotificationContentDto notificationDto)
        {
            if (!_config.Value.IsEnabled)
            {
                _logger.LogDebug("Firebase notifications are disabled");
                return;
            }

            var devices = await GetActiveDevicesByUserAsync(user.UserId);
            var firebaseTokens = devices
                .Where(d => !string.IsNullOrWhiteSpace(d.FirebaseToken))
                .Select(d => d.FirebaseToken)
                .Distinct()
                .ToList();

            if (firebaseTokens.Count == 0)
            {
                _logger.LogDebug("No Firebase tokens found for user {UserId}", user.UserId);
                return;
            }

            try
            {
                var message = BuildFirebaseMessage(notificationDto, devices);
                var result = await _firebaseMessagingService.SendToTokensAsync(firebaseTokens, message);

                _logger.LogInformation(
                    "Firebase notification sent - User: {UserId}, Total: {Total}, Success: {Success}, Failed: {Failed}, Rate: {Rate:F1}%",
                    user.UserId, result.TotalCount, result.SuccessCount, result.FailureCount, result.SuccessRate);

                if (result.FailedTokens.Any())
                {
                    await HandleFailedTokensAsync(result.FailedTokens);
                }

                if (result.SuccessCount > 0)
                {
                    _logger.LogDebug("Successful Firebase send to {Count} device(s).", result.SuccessCount);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send Firebase notification to user {UserId}", user.UserId);
            }
        }

        private async Task<List<UserFirebaseDeviceEntity>> GetActiveDevicesByUserAsync(Guid userId)
        {
            using (_dataFilter.Disable<IMultiTenant>())
            {
                var query = await _userFirebaseDeviceRepo.GetQueryableAsync();
                return await query
                    .AsNoTracking()
                    .Where(x => x.UserId == userId && x.IsActived)
                    .ToListAsync();
            }
        }

        private FirebaseMessage BuildFirebaseMessage(NotificationContentDto notification, List<UserFirebaseDeviceEntity> devices)
        {
            var data = notification.Data?.ToDictionary(kv => kv.Key, kv => kv.Value?.ToString() ?? "") ?? new();

            data["notification_id"] = Guid.NewGuid().ToString();

            var hasIosDevices = devices.Any(d => d.Platform == "ios");
            var hasAndroidDevices = devices.Any(d => d.Platform == "android");

            return new FirebaseMessage
            {
                Title = notification.Title ?? "",
                Body = notification.Body ?? "",
                ImageUrl = "",
                Data = data,
                Priority = "high",
                AndroidConfig = hasAndroidDevices ? new FirebaseAndroidConfig
                {
                    Icon = "ic_notification",
                    Color = "#FF6B35",
                    Sound = "default",
                    ChannelId = "default_channel"
                } : null,
                ApnsConfig = hasIosDevices ? new FirebaseApnsConfig
                {
                    Sound = "default",
                    Badge = 1
                } : null
            };
        }

        private async Task HandleFailedTokensAsync(Dictionary<string, string> failedTokens)
        {
            foreach (var (token, error) in failedTokens)
            {
                try
                {
                    if (!ShouldRemoveToken(error)) continue;

                    var query = await _userFirebaseDeviceRepo.GetQueryableAsync();
                    var device = await query.FirstOrDefaultAsync(x => x.FirebaseToken == token);
                    if (device == null) continue;

                    device.IsActived = false;
                    await _userFirebaseDeviceRepo.UpdateAsync(device);
                    _logger.LogInformation("Deactivated invalid Firebase token for device {DeviceId}", device.DeviceId);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to handle failed Firebase token: {Token}", token);
                }
            }
        }

        private static bool ShouldRemoveToken(string error)
        {
            var lower = error.ToLowerInvariant();
            return lower.Contains("invalid registration") ||
                   lower.Contains("unregistered") ||
                   lower.Contains("not found") ||
                   lower.Contains("mismatched credential");
        }
    }
}
