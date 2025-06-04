namespace Ord.Plugin.Contract.Attributes
{
    public class SqlKataTableNameAttribute : Attribute
    {
        public string TableName;
        public bool IsSoftDelete;

        public SqlKataTableNameAttribute(string tableName, bool isSoftDelete = false)
        {
            TableName = tableName;
            IsSoftDelete = isSoftDelete;
        }
    }
}
