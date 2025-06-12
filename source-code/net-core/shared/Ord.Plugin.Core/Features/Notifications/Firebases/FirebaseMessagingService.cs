using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Core.Features.Notifications.Firebases
{
    public class FirebaseMessagingService : IFirebaseMessagingService, ISingletonDependency
    {
        private readonly FirebaseNotificationConfiguration _config;
        private readonly ILogger<FirebaseMessagingService> _logger;
        private bool _isInitialized = false;
        private readonly SemaphoreSlim _initSemaphore = new(1, 1);

        public FirebaseMessagingService(
            IOptions<FirebaseNotificationConfiguration> config,
            ILogger<FirebaseMessagingService> logger)
        {
            _config = config.Value;
            _logger = logger;
        }

        public async Task<bool> IsInitializedAsync()
        {
            return _isInitialized && FirebaseApp.DefaultInstance != null;
        }

        public async Task InitializeAsync()
        {
            if (_isInitialized) return;

            await _initSemaphore.WaitAsync();
            try
            {
                if (_isInitialized) return;

                if (!_config.IsEnabled)
                {
                    _logger.LogWarning("Firebase is disabled in configuration");
                    return;
                }

                if (string.IsNullOrEmpty(_config.ServiceAccountKeyPath))
                {
                    _logger.LogError("Firebase service account key path is not configured");
                    return;
                }

                if (!File.Exists(_config.ServiceAccountKeyPath))
                {
                    _logger.LogError($"Firebase service account key file not found: {_config.ServiceAccountKeyPath}");
                    return;
                }

                // Initialize Firebase Admin SDK
                if (FirebaseApp.DefaultInstance == null)
                {
                    FirebaseApp.Create(new AppOptions()
                    {
                        Credential = GoogleCredential.FromFile(_config.ServiceAccountKeyPath),
                        ProjectId = _config.ProjectId
                    });
                }

                _isInitialized = true;
                _logger.LogInformation($"Firebase initialized successfully for project: {_config.ProjectId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to initialize Firebase");
                throw;
            }
            finally
            {
                _initSemaphore.Release();
            }
        }

        public async Task<FirebaseSendResult> SendToTokenAsync(string token, FirebaseMessage message)
        {
            if (!await EnsureInitializedAsync())
            {
                return FirebaseSendResult.Failed("Firebase not initialized");
            }

            try
            {
                var firebaseMessage = new Message()
                {
                    Token = token,
                    Notification = new Notification()
                    {
                        Title = message.Title,
                        Body = message.Body,
                        ImageUrl = message.ImageUrl
                    },
                    Data = message.Data,
                    Android = message.AndroidConfig != null ? new AndroidConfig()
                    {
                        Priority = (FirebaseAdmin.Messaging.Priority?)ParseAndroidPriority(message.Priority),
                        Notification = new AndroidNotification()
                        {
                            Icon = message.AndroidConfig.Icon,
                            Color = message.AndroidConfig.Color,
                            Sound = message.AndroidConfig.Sound,
                            ChannelId = message.AndroidConfig.ChannelId
                        }
                    } : null,
                    Apns = message.ApnsConfig != null ? new ApnsConfig()
                    {
                        Aps = new Aps()
                        {
                            Sound = message.ApnsConfig.Sound,
                            Badge = message.ApnsConfig.Badge,
                            Alert = new ApsAlert()
                            {
                                Title = message.Title,
                                Body = message.Body
                            }
                        }
                    } : null
                };
                _logger.LogDebug($"Sending Firebase message to token: {token[..10]}...");
                var response = await FirebaseMessaging.DefaultInstance.SendAsync(firebaseMessage);
                _logger.LogDebug($"Firebase response: {response}");
                return FirebaseSendResult.Success(response);
            }
            catch (FirebaseMessagingException ex)
            {
                _logger.LogError(ex, $"Firebase messaging error for token {token[..10]}...: {ex.MessagingErrorCode}");

                // Handle specific error codes
                var shouldRetry = ex.MessagingErrorCode switch
                {
                    MessagingErrorCode.Unavailable => true,
                    MessagingErrorCode.Internal => true,
                    MessagingErrorCode.InvalidArgument => false,
                    MessagingErrorCode.Unregistered => false,
                    _ => false
                };

                return FirebaseSendResult.Failed(ex.Message, shouldRetry, ex.MessagingErrorCode.ToString());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Unexpected error sending Firebase message to token {token[..10]}...");
                return FirebaseSendResult.Failed(ex.Message);
            }
        }

        public async Task<FirebaseBatchResult> SendToTokensAsync(List<string> tokens, FirebaseMessage message)
        {
            if (!tokens.Any())
            {
                return new FirebaseBatchResult { TotalCount = 0, SuccessCount = 0, FailureCount = 0 };
            }

            if (!await EnsureInitializedAsync())
            {
                return new FirebaseBatchResult
                {
                    TotalCount = tokens.Count,
                    SuccessCount = 0,
                    FailureCount = tokens.Count,
                    FailedTokens = tokens.ToDictionary(t => t, _ => "Firebase not initialized")
                };
            }

            var result = new FirebaseBatchResult { TotalCount = tokens.Count };

            // Process in batches
            var batches = tokens.Chunk(_config.BatchSize);

            foreach (var batch in batches)
            {
                var batchResult = await SendBatchAsync(batch.ToList(), message);
                result.SuccessCount += batchResult.SuccessCount;
                result.FailureCount += batchResult.FailureCount;

                foreach (var failedToken in batchResult.FailedTokens)
                {
                    result.FailedTokens[failedToken.Key] = failedToken.Value;
                }
            }

            return result;
        }

        public async Task<bool> ValidateTokenAsync(string token)
        {
            if (!await EnsureInitializedAsync())
            {
                return false;
            }

            try
            {
                // Firebase doesn't have a direct validation API
                // We can try sending a dry-run message
                var message = new Message()
                {
                    Token = token,
                    Notification = new Notification()
                    {
                        Title = "Validation",
                        Body = "Token validation"
                    }
                };

                // Note: This is a conceptual approach, actual implementation may vary
                // You might want to use your own validation logic
                return !string.IsNullOrWhiteSpace(token) && token.Length > 100;
            }
            catch
            {
                return false;
            }
        }

        private async Task<bool> EnsureInitializedAsync()
        {
            if (!_isInitialized)
            {
                await InitializeAsync();
            }
            return _isInitialized;
        }

        private async Task<FirebaseBatchResult> SendBatchAsync(List<string> tokens, FirebaseMessage message)
        {
            try
            {
                var multicastMessage = new MulticastMessage()
                {
                    Tokens = tokens,
                    Notification = new Notification()
                    {
                        Title = message.Title,
                        Body = message.Body,
                        ImageUrl = message.ImageUrl
                    },
                    Data = message.Data
                };

                var response = await FirebaseMessaging.DefaultInstance.SendMulticastAsync(multicastMessage);

                var result = new FirebaseBatchResult
                {
                    TotalCount = tokens.Count,
                    SuccessCount = response.SuccessCount,
                    FailureCount = response.FailureCount
                };

                // Handle failed tokens
                for (int i = 0; i < response.Responses.Count; i++)
                {
                    if (!response.Responses[i].IsSuccess)
                    {
                        var error = response.Responses[i].Exception?.Message ?? "Unknown error";
                        result.FailedTokens[tokens[i]] = error;
                    }
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send batch Firebase messages");
                return new FirebaseBatchResult
                {
                    TotalCount = tokens.Count,
                    FailureCount = tokens.Count,
                    FailedTokens = tokens.ToDictionary(t => t, _ => ex.Message)
                };
            }
        }

        private Priority ParseAndroidPriority(string priority)
        {
            return priority?.ToLowerInvariant() switch
            {
                "high" => Priority.High,
                "normal" => Priority.Normal,
                _ => Priority.Normal
            };
        }
    }
}
