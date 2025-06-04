namespace Ord.Plugin.Contract.Attributes
{
    public class SqlKataFromRawAttribute : Attribute
    {
        public string FromRaw { get; }
        public bool IsFullGlobalFilter { get; }

        public SqlKataFromRawAttribute(string fromRaw)
        {
            FromRaw = fromRaw;
        }
        public SqlKataFromRawAttribute(string fromRaw, bool isFullGlobalFilter)
        {
            FromRaw = fromRaw;
            IsFullGlobalFilter = isFullGlobalFilter;
        }
    }

    public class SqlKataFromRawFileAttribute : Attribute
    {
        public string FilePath { get; }

        public SqlKataFromRawFileAttribute(string fileName)
        {
            FilePath = Path.GetFullPath("DaoSql/" + fileName + ".sql");
        }
    }
}
