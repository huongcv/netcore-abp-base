using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.Contract.DataExporting;
using Ord.Plugin.Contract.Services.Shop;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Guids;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Security.Encryption;
using Volo.Abp.Uow;
using Volo.Abp.Users;

namespace Ord.Plugin.Contract.Factories
{
    public interface IAppFactory : IScopedDependency
    {
        T LazyService<T>();
        TService GetServiceDependency<TService>();
        IConfiguration Configuration { get; }
        IUnitOfWorkManager UnitOfWorkManager { get; }
        IUnitOfWork CurrentUnitOfWork { get; }
        IMediator Mediator { get; }

        Task<TResponse> SendMediator<TResponse>(IRequest<TResponse> request,
            CancellationToken cancellationToken = default);

        TDestination ObjectMap<TSource, TDestination>(TSource source);
        TDestination ObjectMap<TSource, TDestination>(TSource source, TDestination destination);

        Task<TCacheItem> GetOrAddCachePerRequestAsync<TCacheItem>(string localizedKey, Func<Task<TCacheItem>> factory, Func<DistributedCacheEntryOptions>? optionsFactory = null, bool? hideErrors = null, bool considerUow = false, CancellationToken token = default(CancellationToken)) where TCacheItem : class;
        Guid? CurrentUserId { get; }
        Guid? CurrentTenantId { get; }
        ICurrentTenant CurrentTenant { get; }
        ICurrentUser CurrentUser { get; }
        ICurrentShop CurrentShop { get; }
        IGuidGenerator GuidGenerator { get; }
        IStringEncryptionService StringEncryption { get; }
        IEpplusExportingExcelService EpplusExporting { get; }
        long IdGenerator();
        string GetLocalizedMessage(string key, params object[] formatArgs);
    }
}
