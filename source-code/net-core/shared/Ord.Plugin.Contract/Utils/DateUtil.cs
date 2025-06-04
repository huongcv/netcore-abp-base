namespace Ord.Plugin.Contract.Utils
{
    public static class DateUtil
    {
        public static DateTime? SetTimeForDate(DateTime? moveDate, string? moveTime)
        {
            if (!moveDate.HasValue || string.IsNullOrEmpty(moveTime))
            {
                return moveDate;
            }
            try
            {
                var sptTime = moveTime.Split(":");
                var dateValue = moveDate.Value;
                return new DateTime(dateValue.Year,
                    dateValue.Month,
                    dateValue.Day,
                    sptTime.Length > 0 ? Convert.ToInt32(sptTime[0]) : 0,
                    sptTime.Length > 1 ? Convert.ToInt32(sptTime[1]) : 0,
                    0);
            }
            catch
            {
                return moveDate;
            }
        }

        public static DateTime? SetDefaultDateTime(DateTime? moveDate, string? moveTime)
        {
            var now = DateTime.Now;
            if (string.IsNullOrEmpty(moveTime)) 
            {
                moveTime = $"{now.Hour}:{now.Minute}";
            }
            if (!moveDate.HasValue)
            {
                moveDate = now;
            }
            return SetTimeForDate(moveDate, moveTime);
        }
        public static DateTime StartOfYear(this DateTime source) =>
            new DateTime(source.Year, 1, 1).StartOfDay();

        public static DateTime EndOfYear(this DateTime source) =>
            new DateTime(source.Year, 12, 31).EndOfDay();

        public static DateTime StartOfDay(this DateTime source) => source.Date;

        public static DateTime EndOfDay(this DateTime source) =>
            source.Date.AddDays(1).AddTicks(-1);

        public static DateTime StartOfWeek(this DateTime date, DayOfWeek startDayOfWeek = DayOfWeek.Monday)
        {
            int diff = ((int)date.DayOfWeek - (int)startDayOfWeek + 7) % 7;
            return date.AddDays(-diff).StartOfDay();
        }

        public static DateTime EndOfWeek(this DateTime date, DayOfWeek startDayOfWeek = DayOfWeek.Monday) =>
            date.StartOfWeek(startDayOfWeek).AddDays(6).EndOfDay();

        public static DateTime StartOfMonth(this DateTime date) =>
            new DateTime(date.Year, date.Month, 1).StartOfDay();

        public static DateTime EndOfMonth(this DateTime date) =>
            new DateTime(date.Year, date.Month, DateTime.DaysInMonth(date.Year, date.Month)).EndOfDay();

        public static string FormatDate(string Date)
        {
            try
            {
                if (string.IsNullOrEmpty(Date) || Date.Length != 14 || !long.TryParse(Date, out _))
                {
                    return "Định dạng ngày không hợp lệ";
                }

                DateTime date = DateTime.ParseExact(Date, "yyyyMMddHHmmss", System.Globalization.CultureInfo.InvariantCulture);

                return date.ToString("dd-MM-yyyy HH:mm:ss");
            }
            catch (FormatException)
            {
                return "Lỗi định dạng ngày";
            }
            catch (Exception ex)
            {
                return $"Lỗi không xác định: {ex.Message}";
            }
        }
    }
}
