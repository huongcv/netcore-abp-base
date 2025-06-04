using Microsoft.AspNetCore.Http;
using Ord.Plugin.Contract.Services;

namespace Ord.Plugin.Core.Services
{
    public class IDGenerator : IIDGenerator
    {
        private const long Twepoch = 1689654234000L;
        private const int WorkerIdBits = 5;
        private const int SequenceBits = 12;

        private const long MaxSequence = -1L ^ (-1L << SequenceBits);

        private static readonly object _lock = new object();

        private readonly long _workerId;
        private long _sequence = 0L;
        private long _lastTimestamp = -1L;
        public IDGenerator(IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                var ipAddress = httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress;

                if (ipAddress != null && ipAddress.GetAddressBytes().Length == 4)
                {
                    _workerId = ipAddress.GetAddressBytes()[3];
                }
                else
                {
                    _workerId = new Random().Next(0, 256);
                }
            }
            catch
            {
                _workerId = new Random().Next(0, 256);
            }
        }

        public long GenerateID()
        {
            lock (_lock)
            {
                long timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

                if (timestamp < _lastTimestamp)
                {
                    throw new Exception($"Invalid system clock: timestamp ({timestamp}) should not be less than the previous timestamp ({_lastTimestamp})");
                }

                if (timestamp == _lastTimestamp)
                {
                    _sequence = (_sequence + 1) & MaxSequence;

                    if (_sequence == 0)
                    {
                        timestamp = NextMillis(_lastTimestamp);
                    }
                }
                else
                {
                    _sequence = 0;
                }

                _lastTimestamp = timestamp;

                return ((timestamp - Twepoch) << (WorkerIdBits + SequenceBits))
                       | (_workerId << SequenceBits)
                       | _sequence;
            }
        }
        private long NextMillis(long lastTimestamp)
        {
            long timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            while (timestamp <= lastTimestamp)
            {
                timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            }

            return timestamp;
        }
    }
}
