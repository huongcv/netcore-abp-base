using Ord.Domain.Entities.MasterData;

namespace Ord.EfCore.Default.MigrateDb.ModelBuilders
{
    public class MasterDataModelBuilder
    {
        public static void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<CountryEntity>(b =>
            {
                b.ConfigureByConvention();
                b.HasIndex(x => new
                {
                    x.Code
                });
            });
            builder.Entity<ProvinceEntity>(b =>
            {
                b.ConfigureByConvention();
                b.HasIndex(x => new
                {
                    x.Code
                });
                b.HasIndex(x => new
                {
                    x.CountryCode
                });
            });
        }
    }
}
