using System.Data;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Contract.Data
{
    /// <summary>
    /// Dapper truy vấn db connect string Default
    /// </summary>
    public interface IDapperRepositoryBase
    {
        Task<T?> QueryFirstOrDefaultAsync<T>(
            string sql,
            object? param = null,
            int? commandTimeout = null,
            CommandType? commandType = null);

        Task<dynamic> QueryFirstOrDefaultAsync(
            string sql,
            object? param = null,
            int? commandTimeout = null,
            CommandType? commandType = null);

        Task<IEnumerable<T>> QueryAsync<T>(
            string sql,
            object? param = null,
            int? commandTimeout = null,
            CommandType? commandType = null);

        Task<IEnumerable<dynamic>> QueryAsync(
            string sql,
            object? param = null,
            int? commandTimeout = null,
            CommandType? commandType = null);

        Task<int> ExecuteAsync(string sql, object? param = null, int? commandTimeout = null, CommandType? commandType = null);

        Task<IEnumerable<TValue>> GetListAsync<TValue>(string sql, object param = null, CommandType? commandType = CommandType.Text);

        Task<PagedResultDto<T>> GetPagedListAsync<T>(string sql, object param = null, int skipCount = 0, int maxResult = 10, string orderBy = "Id asc");
        Task<T> GetCount<T>(string sql, object param = null);

        object AddGlobalParam(object param);
    }
}
