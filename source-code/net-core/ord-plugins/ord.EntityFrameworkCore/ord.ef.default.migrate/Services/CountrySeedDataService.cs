using Microsoft.Extensions.Logging;
using Ord.Domain.Entities.MasterData;
using Ord.EfCore.Default.MigrateDb.Base;
using Ord.EfCore.Default.MigrateDb.Data;
using System.Threading.Tasks;

namespace Ord.EfCore.Default.MigrateDb.Services
{
    public class CountrySeedDataService : SeedDataBaseService
    {

        protected override async Task SeedAsync(DbContextMigrate dbContext)
        {
            Logger.LogInformation("Start CountrySeedDataService");
            var vnEntity = await dbContext.Countries.FirstOrDefaultAsync(x => x.Code == "vn");
            if (vnEntity == null)
            {
                vnEntity = new CountryEntity()
                {
                    Code = "vn",
                    Name = "Việt Nam",
                    PhoneCode = "+84",
                    CurrencyCode = "VNĐ",
                    IsActived = true,
                    IsDeleted = false,
                };
                await dbContext.Countries.AddAsync(vnEntity);
                await dbContext.SaveChangesAsync();
                Logger.LogInformation("Successfully add Vietnam Country");
            }
        }
    }
}
