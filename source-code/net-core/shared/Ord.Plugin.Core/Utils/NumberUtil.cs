namespace Ord.Plugin.Core.Utils
{
    public static class NumberUtil
    {
        public static decimal Ceiling(decimal totalAmount)
        {
            int nguyen = (int)Math.Floor(totalAmount);
            double thapPhan = (double)totalAmount - nguyen;

            if (thapPhan >= 0.1)
                return nguyen + 1;
            else
                return nguyen;
        }
        public static decimal Round(decimal? value, int decimals)
        {
            return Math.Round(value ?? 0, decimals, MidpointRounding.AwayFromZero);
        }
    }
}
