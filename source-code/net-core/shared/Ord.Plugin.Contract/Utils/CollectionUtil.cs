namespace Ord.Plugin.Contract.Utils
{
    public static class CollectionUtil
    {
        public static bool IsNullOrEmpty<T>(IEnumerable<T> list)
        {
            return list == null || !list.Any();
        }
    }
}
