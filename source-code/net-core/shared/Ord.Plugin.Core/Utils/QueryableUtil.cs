using Microsoft.EntityFrameworkCore;
using Ord.Contract.Dtos.CommonDto;
using System.Linq.Dynamic.Core;
using System.Linq.Expressions;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Threading;

namespace Ord.Plugin.Core.Utils
{
    public static class QueryableUtil
    {
        public static async Task<PagedResultDto<TItem>> GetPagedResultAsync<TItem>(this PagedAndSortedResultRequestDto pagedRequest, IQueryable<TItem> query)
        {
            var result = new PagedResultDto<TItem>
            {
                TotalCount = await query.CountAsync()
            };
            if (result.TotalCount > 0)
            {
                var itemsQuery = string.IsNullOrWhiteSpace(pagedRequest.Sorting)
                    ? query
                    : query.OrderBy(pagedRequest.Sorting);
                result.Items = await itemsQuery
                    .Skip(pagedRequest.SkipCount)
                    .Take(pagedRequest.MaxResultCount).ToListAsync();
            }
            return result;

        }
        /// <summary>
        /// Tìm kiếm không dấu cho MySql
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="query"></param>
        /// <param name="textSearch"></param>
        /// <param name="columns"></param>
        /// <returns></returns>
        public static IQueryable<T> WhereLikeText<T>(this IQueryable<T> query, string textSearch, params string[] columns)
        {
            if (string.IsNullOrEmpty(textSearch))
            {
                return query;
            }
            if (columns?.Any() != true)
            {
                return query;
            }
            var predicate = PredicateBuilder.New<T>(x =>
                EF.Functions.Like(EF.Property<string>(x, columns[0]),
                    textSearch));
            if (columns.Length <= 1)
            {
                return query.Where(predicate);
            }
            foreach (var column in columns.Skip(1))
            {
                predicate = predicate.Or(x =>
                    EF.Functions.Like(EF.Property<string>(x, column),
                        textSearch));
            }

            return query.Where(predicate);
        }
        public static IQueryable<T> WhereLikeText<T>(this IQueryable<T> query, string textSearch, Expression<Func<T, object>> properties)

        {
            if (string.IsNullOrEmpty(textSearch))
            {
                return query;
            }
            if (properties == null)
            {
                return query;
            }
            var colums = GetColumnNames(properties);
            return WhereLikeText(query, textSearch, colums);
        }

        public static IQueryable<T> WhereDateRange<T>(this IQueryable<T> query, DateRangeDto dateRange, Expression<Func<T, DateTime?>> property)
        {
            if (dateRange == null || (!dateRange.StartDate.HasValue && !dateRange.EndDate.HasValue))
            {
                return query;
            }

            var memberExpression = QueryableUtil.ResolveMemberExpression(property.Body);
            var column = memberExpression.Member.Name;
            if (string.IsNullOrEmpty(column))
            {
                return query;
            }

            if (dateRange.StartDate.HasValue)
            {
                var startDate = new DateTime(dateRange.StartDate.Value.Year, dateRange.StartDate.Value.Month, dateRange.StartDate.Value.Day);
                query = query.Where(x => EF.Property<DateTime?>(x, column) >= startDate);
            }
            if (dateRange.EndDate.HasValue)
            {
                var endDate = new DateTime(dateRange.EndDate.Value.Year, dateRange.EndDate.Value.Month, dateRange.EndDate.Value.Day);
                var endDateExclusive = endDate.AddDays(1);
                query = query.Where(x => EF.Property<DateTime?>(x, column) < endDateExclusive);
            }
            return query;
        }

        #region  Hỗ trợ đọc tên column từ biểu thức linq

        private static string[] GetColumnNames<T>(Expression<Func<T, object>> property)
        {
            var body = (NewExpression)property.Body;
            var members = body.Arguments.Select(ResolveMemberExpression).ToArray();
            return members?.Any() == true ? members.Select(x => x.Member.Name).ToArray() : null;
        }
        private static MemberExpression ResolveMemberExpression(Expression expression)
        {
            if (expression is MemberExpression)
            {
                return (MemberExpression)expression;
            }
            else if (expression is UnaryExpression)
            {
                // if casting is involved, Expression is not x => x.FieldName but x => Convert(x.Fieldname)
                return (MemberExpression)((UnaryExpression)expression).Operand;
            }
            else
            {
                throw new NotSupportedException(expression.ToString());
            }
        }
        #endregion

        public static IQueryable<TEntity> ToQueryable<TEntity>(this IRepository<TEntity> repository, bool isAsNoTracking = true)
        where TEntity : class, IEntity
        {
            var q = AsyncHelper.RunSync(repository.GetQueryableAsync);;
            if (isAsNoTracking)
            {
                q.AsNoTracking();
            }
            return q;
        }

        public static async Task<PagedResultDto<TResult>> GetPagedResultAsync<TResult>(this IQueryable<TResult> query, PagedAndSortedResultRequestDto input)
        {
            var count = await query.CountAsync().ConfigureAwait(false);
            if (count == 0)
            {
                return new PagedResultDto<TResult>();
            }
            if (!string.IsNullOrEmpty(input.Sorting))
            {
                query = query.OrderBy(input.Sorting);
            }
            var items = await query.Skip(input.SkipCount).Take(input.MaxResultCount)
                .ToListAsync().ConfigureAwait(false);
            return new PagedResultDto<TResult>(count, items);
        }
        public static PagedResultDto<TResult> GetPagedResult<TResult>(this IQueryable<TResult> query, PagedAndSortedResultRequestDto input)
        {
            return AsyncHelper.RunSync(() => GetPagedResultAsync(query, input));
        }

    }
}
