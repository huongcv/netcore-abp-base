using DigitalSignature;
using Microsoft.Extensions.Configuration;
using Ord.Plugin.Contract.Factories;
using StackExchange.Redis;
using Volo.Abp.Application.Services;
using Volo.Abp.Security.Encryption;

namespace Ord.Plugin.HostBase.AppServices
{
    [OrdAuth("SuperAdmin")]
    public class SysToolAppService(IConfiguration configuration, IAppFactory appFactory) : ApplicationService
    {
        public Task SyncTemplatesToMinioAsync()
        {
            return appFactory.GetServiceDependency<TemplateSyncService>().SyncTemplatesToMinioAsync();
        }
        public async Task ClearAllCacheInRedis()
        {
            var connectionMultiplexer = await ConnectionMultiplexer.ConnectAsync(configuration["Redis:Configuration"],
                x =>
                {
                    x.AllowAdmin = true;
                });
            var servers = connectionMultiplexer.GetServers();
            if (servers != null)
            {
                foreach (var server in servers)
                {
                    await server.FlushAllDatabasesAsync();
                }
            }
        }

        public string GetEncrypted(string value)
        {
            return appFactory.GetServiceDependency<IStringEncryptionService>().Encrypt(value);
        }

        public void TestCertificate()
        {
            var certBase64 = "MIIDDDCCAfSgAwIBAgIIatA0r6gnBVgwDQYJKoZIhvcNAQELBQAwFDESMBAGA1UEAxMJbG9jYWxo\r\nb3N0MB4XDTI1MDUyODA3MDkzM1oXDTI2MDUyODA3MDkzM1owFDESMBAGA1UEAxMJbG9jYWxob3N0\r\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvQQgY1xNf8MdqhhOgxiyw9oPjc5Xdc6W\r\nFf7hU9vClfeQHWmGyTV/OiE1b31v+7FiXWZb727u6/Ue9IqW+K7C4Mf18kipr5OLbOXiB6x+CEXd\r\nWtC5fZafB1icGfp4CYlaM+4BxRLyD4wy+v+t7kYyQ7ow+sM5gru3hyEO7KrydrXhs0UfT5utqmVt\r\nhhapYh38AN5lk217i3CvUYxLcqqVmS1GVXa5U6mBuwKcfLeP1ylHACEufXSptN1RUBYpSnwfdGSR\r\ntczDZqfitIsP9kI797VjcuUOG704Vpk6IhJ1SxG1NWGpy/Phu0FX8VA9uyKln5BY8+caDBHU5yDn\r\np9/TPQIDAQABo2IwYDAMBgNVHRMBAf8EAjAAMA4GA1UdDwEB/wQEAwIFoDAWBgNVHSUBAf8EDDAK\r\nBggrBgEFBQcDATAXBgNVHREBAf8EDTALgglsb2NhbGhvc3QwDwYKKwYBBAGCN1QBAQQBAjANBgkq\r\nhkiG9w0BAQsFAAOCAQEAYNFWoWMCupP5YTY53WRdOCNNW0UyiYwJOiV4dsUf0hCuvllPX0Lzd8vQ\r\nOjEhEiEtT990zsYtZB2dniS9ZGzEBGDRSymLR0p/W2/q98LJgSek6BfdZwUsFfj11h1TaJu/l7L4\r\nzIV5xRqqPN0vODk3zXyraGUnA3GMSbZbqokdYGgIikO30MXYrOJ3kiOOaqvQZIljIvfmTjd6f4o+\r\nzWfWazx3yszMPjygbP0obqI1H6ISzCxTdUWzTalsZ0pYvfOjtMHja5WkYZUvJ444RDSAr0DOenkK\r\n9hdwpjJn21ExiXNh7VBApy5j/Q4+ESXyFpUB+Ti8mO+lo+l52sbhPu94ZQ==";
            CertificateConverter.ConvertBase64ToCertificate(certBase64);
        }
    }
}
