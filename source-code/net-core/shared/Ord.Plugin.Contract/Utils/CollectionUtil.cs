namespace Ord.Plugin.Contract.Utils
{
    public static class CollectionUtil
    {
        public static bool IsNullOrEmpty<T>(IEnumerable<T> list)
        {
            return list == null || !list.Any();
        }
        public static bool IsNullOrEmpty<T>(this ICollection<T> source)
        {
            return source == null || source.Count <= 0;
        }
        public static bool AddIfNotContains<T>(this ICollection<T> source, T item)
        {
            if (source == null)
                throw new ArgumentNullException(nameof(source));
            if (source.Contains(item))
                return false;
            source.Add(item);
            return true;
        }
        public static bool AddIfNotContains<T>(
            this ICollection<T> source,
            T item,
            Func<T, bool> predicate)
        {
            if (source == null)
                throw new ArgumentNullException(nameof(source));
            if (predicate == null)
                throw new ArgumentNullException(nameof(predicate));

            if (source.Any(predicate))
                return false;

            source.Add(item);
            return true;
        }
    }
}
