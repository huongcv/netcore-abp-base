﻿using Ord.Plugin.Auth;
using Ord.Plugin.Core;
using Ord.Plugin.HostBase;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Auditing;
using Volo.Abp.BlobStoring;
using Volo.Abp.BlobStoring.Minio;
using Volo.Abp.EntityFrameworkCore.MySQL;
using Volo.Abp.Modularity;

namespace Ord.PluginZero.HttpHost
{
    [DependsOn(
        typeof(AbpAspNetCoreMvcModule),
        typeof(AbpEntityFrameworkCoreMySQLModule),
        typeof(OrdPluginCoreModule),
        typeof(OrdPluginHostBaseModule),
        typeof(AbpBlobStoringMinioModule)
    )]
    [DependsOn(typeof(OrdPluginAuthModule),
        typeof(OrdPluginMasterDataModule))]
    [DependsOn(typeof(OrdEfCoreDefaultModule))]
    public class OrdPosHttpHostModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            var services = context.Services;
            var configuration = context.Services.GetConfiguration();
            //services.AddHostedService<SeedDataStartupTask>();
            Configure<AbpAuditingOptions>(options =>
            {
                options.IsEnabled = true;
                options.IsEnabledForGetRequests = true;
            });
            Configure<AbpBlobStoringOptions>(options =>
            {
                if (configuration.TryParseBoolValue("BlobStoring:Minio:IsEnabled"))
                {
                    options.Containers.ConfigureDefault(container =>
                    {
                        container.UseMinio(minio =>
                        {
                            minio.EndPoint = configuration["BlobStoring:Minio:EndPoint"]; // your minio endPoint
                            minio.AccessKey = configuration["BlobStoring:Minio:AccessKey"]; // your minio accessKey
                            minio.SecretKey = configuration["BlobStoring:Minio:SecretKey"]; // your minio secretKey
                            minio.BucketName = configuration["BlobStoring:Minio:BucketName"]; // your minio bucketName
                            minio.CreateBucketIfNotExists = true;
                        });
                    });
                }
                
            });
        }

        public override void OnApplicationInitialization(ApplicationInitializationContext context)
        {
            var app = context.GetApplicationBuilder();
            var env = context.GetEnvironment();
        }
    }
}