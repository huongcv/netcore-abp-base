using Dapper;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.Contract.Factories;
using System.Data;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories.Dapper;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.Plugin.Core.Data
{
    public class DapperRepositoryBase<TDbContext> : DapperRepository<TDbContext>, IDapperDbContext
        where TDbContext : IEfCoreDbContext
    {
        protected IAppFactory AppFactory => LazyServiceProvider.LazyGetRequiredService<IAppFactory>();
        public DapperRepositoryBase(IDbContextProvider<TDbContext> dbContextProvider) : base(dbContextProvider)
        {

        }
        public Task<T?> QueryFirstOrDefaultAsync<T>(
            string sql,
            object? param = null,
            int? commandTimeout = null,
            CommandType? commandType = null)
        {
            return DbConnection.QueryFirstOrDefaultAsync<T>(sql, param, DbTransaction, commandTimeout, commandType);
        }
        public Task<dynamic> QueryFirstOrDefaultAsync(
            string sql,
            object? param = null,
            int? commandTimeout = null,
            CommandType? commandType = null)
        {
            return DbConnection.QueryFirstOrDefaultAsync(sql, param, DbTransaction, commandTimeout, commandType);
        }
        public Task<IEnumerable<T>> QueryAsync<T>(
            string sql,
            object? param = null,
            int? commandTimeout = null,
            CommandType? commandType = null)
        {
            return DbConnection.QueryAsync<T>(sql, param, DbTransaction, commandTimeout, commandType);
        }
        public Task<IEnumerable<dynamic>> QueryAsync(
            string sql,
            object? param = null,
            int? commandTimeout = null,
            CommandType? commandType = null)
        {
            return DbConnection.QueryAsync(sql, param, DbTransaction, commandTimeout, commandType);
        }

        public Task<int> ExecuteAsync(string sql, object? param = null,
            int? commandTimeout = null, CommandType? commandType = null)
        {
            return DbConnection.ExecuteAsync(sql, param, DbTransaction, commandTimeout, commandType);
        }

        public async Task<IEnumerable<TValue>> GetListAsync<TValue>(string sql, object param = null, CommandType? commandType = CommandType.Text)
        {
            return await DbConnection.QueryAsync<TValue>(sql, param, transaction: DbTransaction, commandType: commandType);
        }
        public async Task<PagedResultDto<T>> GetPagedListAsync<T>(string sql, object param = null, int skipCount = 0, int maxResult = 10, string orderBy = "Id asc")
        {
            var sqlItems = $@"
            {sql} limit {skipCount}, {maxResult}
            ";
            var itemsTsk = (await GetListAsync<T>(sqlItems, param)).ToList();
            var sqlCount = $"select count(1) from ({sql}) A";
            var countTsk = await QueryFirstOrDefaultAsync<int>(sqlCount, param);
            return new PagedResultDto<T>()
            {
                TotalCount = countTsk,
                Items = itemsTsk
            };
        }
        public async Task<T> GetCount<T>(string sql, object param = null)
        {
            var sqlCount = $"select count(1) from ({sql}) A";
            
            var countTsk = await QueryFirstOrDefaultAsync<T>(sqlCount, param);
            return countTsk;
        }

        public async Task<ExtensiblePagedResultDto<T>> GetExtensiblePagedListAsync<T>(string sql, object param = null, int skipCount = 0, int maxResult = 10, string orderBy = "Id asc")
        {
            var sqlItems = $@"
            {sql} limit {skipCount}, {maxResult}
            ";
            var itemsTsk = (await GetListAsync<T>(sqlItems, param)).ToList();
            var sqlCount = $"select count(1) from ({sql}) A";
            var countTsk = await QueryFirstOrDefaultAsync<int>(sqlCount, param);
            return new ExtensiblePagedResultDto<T>()
            {
                TotalCount = countTsk,
                Items = itemsTsk
            };
        }

        public object AddGlobalParam(object param)
        {
            var parameters = param as DynamicParameters ?? new DynamicParameters(param);
            parameters.Add("TenantId", CurrentTenant?.Id);
            return parameters;
        }
    }
}
