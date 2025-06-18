using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Localization;
using Ord.Plugin.Contract.Services;
using Ord.Plugin.Contract.Services.Shop;
using Ord.Plugin.Core.Caching;
using System.Globalization;
using System.Text.RegularExpressions;
using Volo.Abp.Caching;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Guids;
using Volo.Abp.MultiTenancy;
using Volo.Abp.ObjectMapping;
using Volo.Abp.Security.Encryption;
using Volo.Abp.Uow;
using Volo.Abp.Users;

namespace Ord.Plugin.Core.Factories
{
    public class AppFactory : IAppFactory
    {
        private readonly IAbpLazyServiceProvider _lazyServiceProvider;
        public AppFactory(IAbpLazyServiceProvider lazyServiceProvider)
        {
            _lazyServiceProvider = lazyServiceProvider;
        }
        private Dictionary<Type, object> _serviceDependencies;
        private readonly object _lock = new object();

        public TService GetServiceDependency<TService>() => LazyService<TService>();
        public T LazyService<T>()
        {
            lock (_lock)
            {
                _serviceDependencies ??= new Dictionary<Type, object>();
                var type = typeof(T);
                if (!_serviceDependencies.ContainsKey(type))
                {
                    _serviceDependencies[type] = _lazyServiceProvider.LazyGetRequiredService<T>();
                }
                return (T)_serviceDependencies[type];
            }
        }
        public IConfiguration Configuration => LazyService<IConfiguration>();
        public ICurrentTenant CurrentTenant => LazyService<ICurrentTenant>();
        public ICurrentUser CurrentUser => LazyService<ICurrentUser>();
        public ICurrentShop CurrentShop => LazyService<ICurrentShop>();
        public IGuidGenerator GuidGenerator => _lazyServiceProvider.LazyGetService<IGuidGenerator>(SimpleGuidGenerator.Instance);
        public IStringEncryptionService StringEncryption => LazyService<IStringEncryptionService>();
        public IEpplusExportingExcelService EpplusExporting => LazyService<IEpplusExportingExcelService>();
        public long IdGenerator()
        {
            var service = GetServiceDependency<IIDGenerator>();
            return service.GenerateID();
        }
        public string GetLocalizedMessage(string key, params object[] formatArgs)
        {
            var l = GetServiceDependency<IOrdLocalizer>();
            if (string.IsNullOrWhiteSpace(key))
            {
                return string.Empty;
            }
            return formatArgs?.Length > 0
                ? l[key, formatArgs]
                : l[key];
        }

        public string GetCurrentCulture()
        {
            var culture = CultureInfo.CurrentUICulture.Name;
            if (string.IsNullOrEmpty(culture))
            {
                return "vi";
            }
            if (culture.Contains('-'))
            {
                return culture.Split('-')[0].ToLower();
            }

            return culture.ToLower();
        }

        public IHttpContextAccessor HttpContextAccessor => LazyService<IHttpContextAccessor>();
        public IUnitOfWorkManager UnitOfWorkManager => LazyService<IUnitOfWorkManager>();
        public IMediator Mediator => LazyService<IMediator>();

        #region Auto Mapper

        private Type? ObjectMapperContext { get; set; }
        private IObjectMapper ObjectMapper => _lazyServiceProvider.LazyGetService<IObjectMapper>(provider =>
            ObjectMapperContext == null
                ? provider.GetRequiredService<IObjectMapper>()
                : (IObjectMapper)provider.GetRequiredService(typeof(IObjectMapper<>).MakeGenericType(ObjectMapperContext)));
        public Task<TResponse> SendMediator<TResponse>(IRequest<TResponse> request, CancellationToken cancellationToken = default)
        {
            return Mediator.Send(request, cancellationToken);
        }
        public TDestination ObjectMap<TSource, TDestination>(TSource source)
        {
            return ObjectMapper.Map<TSource, TDestination>(source);
        }
        public TDestination ObjectMap<TSource, TDestination>(TSource source, TDestination destination)
        {
            return ObjectMapper.Map(source, destination);
        }

        #endregion


        #region Cache

        public async Task<TCacheItem> GetOrAddCachePerRequestAsync<TCacheItem>(
            string localizedKey,
            Func<Task<TCacheItem>> factory,
            Func<DistributedCacheEntryOptions>? optionsFactory = null,
            bool? hideErrors = null,
            bool considerUow = false,
            CancellationToken token = default(CancellationToken)
        ) where TCacheItem : class
        {
            var distributedCache = LazyService<IDistributedCache<TCacheItem>>();
            var httpContextAccessor = LazyService<IHttpContextAccessor>();
            var httpContext = httpContextAccessor.HttpContext;
            if (httpContext == null)
            {
                return await distributedCache.GetOrAddAsync(localizedKey, factory, optionsFactory, hideErrors,
                    considerUow, token);
            }
            if (httpContext.Items.ContainsKey(localizedKey))
            {
                var conditionalValue = (ConditionalValue<TCacheItem>)httpContext.Items[localizedKey];
                return conditionalValue.HasValue ? conditionalValue.Value : default;
            }

            var value = await distributedCache.GetOrAddAsync(localizedKey, factory, optionsFactory, hideErrors,
                considerUow, token);
            httpContext.Items[localizedKey] = new ConditionalValue<TCacheItem>(value != default, value);
            return value;
        }

        #endregion

        #region Current user
        public Guid? CurrentUserId => CurrentUser?.Id;
        public Guid? CurrentTenantId => CurrentTenant?.Id;
        #endregion
        public IUnitOfWork CurrentUnitOfWork => UnitOfWorkManager?.Current;
    }
}
