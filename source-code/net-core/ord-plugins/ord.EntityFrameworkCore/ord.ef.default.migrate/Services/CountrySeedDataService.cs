using Microsoft.Extensions.Logging;
using Ord.Domain.Entities.MasterData;
using Ord.EfCore.Default.MigrateDb.Base;
using Ord.EfCore.Default.MigrateDb.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Ord.EfCore.Default.MigrateDb.Services
{
    public class CountrySeedDataService : SeedDataBaseService
    {
        protected override async Task SeedAsync(DbContextMigrate dbContext)
        {
            Logger.LogInformation("####################### Start Country Seed ########################");

            var countries = new List<CountryEntity>
            {
                new CountryEntity
                {
                    Code = "vn",
                    Name = "Việt Nam",
                    PhoneCode = "+84",
                    CurrencyCode = "VND",
                    IsActived = true,
                    IsDeleted = false
                },
                new CountryEntity
                {
                    Code = "us",
                    Name = "United States",
                    PhoneCode = "+1",
                    CurrencyCode = "USD",
                    IsActived = true,
                    IsDeleted = false
                },
                new CountryEntity
                {
                    Code = "jp",
                    Name = "Japan",
                    PhoneCode = "+81",
                    CurrencyCode = "JPY",
                    IsActived = true,
                    IsDeleted = false
                },
                new CountryEntity
                {
                    Code = "kr",
                    Name = "South Korea",
                    PhoneCode = "+82",
                    CurrencyCode = "KRW",
                    IsActived = true,
                    IsDeleted = false
                },
                new CountryEntity
                {
                    Code = "fr",
                    Name = "France",
                    PhoneCode = "+33",
                    CurrencyCode = "EUR",
                    IsActived = true,
                    IsDeleted = false
                },
                new CountryEntity
                {
                    Code = "de",
                    Name = "Germany",
                    PhoneCode = "+49",
                    CurrencyCode = "EUR",
                    IsActived = true,
                    IsDeleted = false
                }
            };

            foreach (var country in countries)
            {
                await AddCountryIfNotExists(dbContext, country);
            }

            Logger.LogInformation("####################### End Country Seed ##########################");
        }

        private async Task AddCountryIfNotExists(DbContextMigrate dbContext, CountryEntity country)
        {
            country.Code = country.Code.ToUpper();
            if (!await dbContext.Countries.AnyAsync(c => c.Code == country.Code))
            {
                await dbContext.Countries.AddAsync(country);
                await dbContext.SaveChangesAsync();
                Logger.LogInformation($"Added country: {country.Code} - {country.Name}");
            }
            else
            {
                Logger.LogInformation($"Country already exists: {country.Code}");
            }
        }
    }
}
