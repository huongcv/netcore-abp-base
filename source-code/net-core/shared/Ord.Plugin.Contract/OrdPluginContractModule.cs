using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OfficeOpenXml;
using Ord.Plugin.Auth;
using Ord.Plugin.Contract.Configurations;
using Ord.Plugin.Contract.Localization;
using System.Text;
using Volo.Abp;
using Volo.Abp.Autofac;
using Volo.Abp.AutoMapper;
using Volo.Abp.FluentValidation;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Volo.Abp.Security;
using Volo.Abp.Security.Encryption;
using Volo.Abp.Validation.Localization;
using Volo.Abp.VirtualFileSystem;

namespace Ord.Plugin.Contract
{
    [DependsOn(typeof(AbpAutoMapperModule),
        typeof(AbpSecurityModule),
        typeof(AbpAutofacModule),
        typeof(AbpFluentValidationModule),
        typeof(AbpFluentValidationModule),
        typeof(AbpLocalizationModule),
        typeof(AbpVirtualFileSystemModule),
        typeof(OrdDomainModule)
        )]
    public class OrdPluginContractModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            var services = context.Services;
            var configuration = context.Services.GetConfiguration();
            ConfigurationOptions(services);
            Configure<AbpAutoMapperOptions>(options =>
            {
                options.AddMaps<OrdPluginContractModule>(validate: false);
            });
            var defaultPassPhrase = configuration["App:Name"] + "Or3nd@numb3r011E";
            Configure<AbpStringEncryptionOptions>(opts =>
            {
                opts.DefaultPassPhrase = defaultPassPhrase;
                opts.DefaultSalt = Encoding.UTF8.GetBytes(defaultPassPhrase);
            });
            LocalizationConfiguration();
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

        }

        void ConfigurationOptions(IServiceCollection services)
        {
            TryCatchOptionAddSingleton<AuthPluginConfig>(services, "AuthPlugin");
            TryCatchOptionAddSingleton<AppSettings>(services, "App");
            TryCatchOptionAddSingleton<AuthenticationSettings>(services, "Authentication");
        }

        void LocalizationConfiguration()
        {
            Configure<AbpVirtualFileSystemOptions>(options =>
            {
                options.FileSets.AddEmbedded<OrdPluginContractModule>("Ord.Plugin.Contract");
            });
            Configure<AbpLocalizationOptions>(options =>
            {
                options.Resources
                    .Add<OrdLocalizationResource>("vi")
                    .AddBaseTypes(typeof(AbpValidationResource))
                    .AddVirtualJson("/Localization/Ord");
                options.Resources
                    .Get<OrdLocalizationResource>()
                    .AddVirtualJson("/Localization/Validation");
                options.Resources
                    .Get<OrdLocalizationResource>()
                    .AddVirtualJson("/Localization/PropertyName");
                options.Languages.Add(new LanguageInfo("en", "en", "English"));
                options.Languages.Add(new LanguageInfo("vi", "vi", "Tiếng Việt"));
            });
        }

        public override void OnApplicationInitialization(ApplicationInitializationContext context)
        {
            var services = context.ServiceProvider;
            FullAppSettingConfig.GetInstance(services);
        }
        private void TryCatchOptionAddSingleton<TOption>(IServiceCollection services, string keySection)
        where TOption : class
        {
            var configuration = services.GetConfiguration();
            try
            {
                services.AddSingleton<TOption>(configuration.GetSection(keySection).Get<TOption>());
            }
            catch
            {
                //
            }
        }
    }
}
