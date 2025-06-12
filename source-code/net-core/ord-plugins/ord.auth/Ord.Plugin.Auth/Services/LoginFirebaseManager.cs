using Microsoft.Extensions.Logging;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Shared.Dtos.Auths;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Features.Notifications.Entities;
using System.Text;

namespace Ord.Plugin.Auth.Services
{
    public class LoginFirebaseManager(ILogger<LoginFirebaseManager> logger,
        IUserFirebaseDeviceRepository userDeviceRepository) : OrdAuthManagerBase, ILoginFirebaseManager
    {
        public async Task HandleFirebaseTokenOnLoginAsync(Guid userId, FireBaseDto firebaseDto)
        {
            try
            {
                // Skip if no firebase token provided
                if (string.IsNullOrWhiteSpace(firebaseDto.FireBaseToken))
                {
                    logger.LogInformation($"No Firebase token provided for user {userId}");
                    return;
                }

                // Validate platform
                var platform = ValidatePlatform(firebaseDto.Platform);

                // Generate device ID if not provided
                var deviceId = !string.IsNullOrWhiteSpace(firebaseDto.DeviceId)
                    ? firebaseDto.DeviceId
                    : GenerateDeviceId(userId, firebaseDto.FireBaseToken, platform);

                // Check if device already exists
                var existingDevice = await userDeviceRepository.FindByDeviceIdAsync(userId, deviceId);

                if (existingDevice != null)
                {
                    await UpdateExistingDeviceAsync(existingDevice, firebaseDto);
                }
                else
                {
                    await CreateNewDeviceAsync(userId, deviceId, firebaseDto, platform);
                }

                // Cleanup old/inactive devices
                await CleanupOldDeviceTokensAsync(userId, deviceId);

                logger.LogInformation($"Successfully handled Firebase token for user {userId}, device {deviceId}");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Failed to handle Firebase token for user {userId}");
                // Don't throw exception to avoid blocking login process
            }
        }

        public async Task CleanupOldDeviceTokensAsync(Guid userId, string? currentDeviceId = null)
        {
            try
            {
                var allUserDevices = await userDeviceRepository.GetByUserIdAsync(userId);

                // Deactivate devices that haven't been active for more than 30 days
                var inactiveDevices = allUserDevices.Where(d =>
                    d.IsActived &&
                    d.DeviceId != currentDeviceId &&
                    (!d.LastLoginTime.HasValue || d.LastLoginTime.Value < Clock.Now.AddDays(-30))
                ).ToList();

                foreach (var device in inactiveDevices)
                {
                    device.IsActived = false;
                    logger.LogInformation($"Deactivated inactive device {device.DeviceId} for user {userId}");
                }

                if (inactiveDevices.Any())
                {
                    await userDeviceRepository.UpdateManyAsync(inactiveDevices);
                }

                // Keep only the latest 5 active devices per user
                var activeDevices = allUserDevices
                    .Where(d => d.IsActived && d.DeviceId != currentDeviceId)
                    .OrderByDescending(d => d.LastLoginTime ?? d.CreationTime)
                    .Skip(4) // Keep 4 + current = 5 devices max
                    .ToList();

                foreach (var device in activeDevices)
                {
                    device.IsActived = false;
                    logger.LogInformation($"Deactivated excess device {device.DeviceId} for user {userId}");
                }

                if (activeDevices.Any())
                {
                    await userDeviceRepository.UpdateManyAsync(activeDevices);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Failed to cleanup old devices for user {userId}");
            }
        }

        public async Task UpdateDeviceLastActiveAsync(Guid userId, string? firebaseToken)
        {
            if (string.IsNullOrWhiteSpace(firebaseToken))
                return;

            try
            {
                var device = await userDeviceRepository.FindByFirebaseTokenAsync(firebaseToken);
                if (device != null && device.UserId == userId)
                {
                    device.LastLoginTime = DateTime.Now;
                    await userDeviceRepository.UpdateAsync(device);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Failed to update device last active time for token {firebaseToken}");
            }
        }
        private async Task UpdateExistingDeviceAsync(UserFirebaseDeviceEntity existingDevice, FireBaseDto firebaseDto)
        {
            // Update device information
            existingDevice.FirebaseToken = firebaseDto.FireBaseToken!;
            existingDevice.LastLoginTime = DateTime.Now;
            existingDevice.IsActived = true;

            await userDeviceRepository.UpdateAsync(existingDevice);

            logger.LogInformation($"Updated existing device {existingDevice.DeviceId} for user {existingDevice.UserId}");
        }
        private string ValidatePlatform(string? platform)
        {
            if (string.IsNullOrWhiteSpace(platform))
            {
                return "unknown";
            }

            var normalizedPlatform = platform.ToLowerInvariant();
            return normalizedPlatform switch
            {
                "ios" or "iphone" or "ipad" => "ios",
                "android" => "android",
                "web" or "browser" => "web",
                _ => "unknown"
            };
        }
        private string GenerateDeviceId(Guid userId, string firebaseToken, string platform)
        {
            // Generate a consistent device ID based on user and token
            var input = $"{userId}_{firebaseToken}_{platform}";
            var hash = System.Security.Cryptography.SHA256.HashData(Encoding.UTF8.GetBytes(input));
            return Convert.ToHexString(hash)[..16].ToLowerInvariant();
        }
        private async Task CreateNewDeviceAsync(Guid userId, string deviceId, FireBaseDto firebaseDto, string platform)
        {
            // Check if another user is using the same Firebase token
            var conflictDevice = await userDeviceRepository.FindByFirebaseTokenAsync(firebaseDto.FireBaseToken!);
            if (conflictDevice != null && conflictDevice.UserId != userId)
            {
                // Deactivate the conflicting device
                conflictDevice.IsActived = false;
                await userDeviceRepository.UpdateAsync(conflictDevice);

                logger.LogWarning($"Deactivated conflicting device {conflictDevice.DeviceId} " +
                                  $"for user {conflictDevice.UserId} due to token reuse by user {userId}");
            }

            var newDevice = new UserFirebaseDeviceEntity()
            {
                TenantId = CurrentTenant.Id,
                UserId = userId,
                FirebaseToken = firebaseDto.FireBaseToken!,
                DeviceId = deviceId,
                Platform = platform,
                DeviceName = firebaseDto.DeviceName,
                IsActived = true
            };
            await userDeviceRepository.InsertAsync(newDevice);
            logger.LogInformation($"Created new device {deviceId} for user {userId}");
        }
    }
}
