using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ord.Plugin.Contract.Utils
{
    public static class SimpleIdGenerator
    {
        private static readonly object _lock = new();
        private static long _lastTimestamp = -1;
        private static long _sequence = 0;
        private const int MaxSequence = 999;

        public static long Generate()
        {
            lock (_lock)
            {
                long timestamp = long.Parse(DateTime.UtcNow.ToString("yyyyMMddHHmmssfff")); 

                if (timestamp == _lastTimestamp)
                {
                    _sequence++;
                    if (_sequence > MaxSequence)
                    {
                        while (timestamp <= _lastTimestamp)
                        {
                            timestamp = long.Parse(DateTime.UtcNow.ToString("yyyyMMddHHmmssfff"));
                        }
                        _sequence = 0;
                    }
                }
                else
                {
                    _sequence = 0;
                }

                _lastTimestamp = timestamp;

                string raw = (timestamp.ToString() + _sequence.ToString("D3")).Substring(0, 16);
                return long.Parse(raw);
            }
        }
    }
}
