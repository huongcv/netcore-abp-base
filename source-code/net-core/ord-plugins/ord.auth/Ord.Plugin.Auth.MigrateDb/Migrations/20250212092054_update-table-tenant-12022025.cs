using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ord.Plugin.Auth.MigrateDb.Migrations
{
    /// <inheritdoc />
    public partial class updatetabletenant12022025 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsStock",
                table: "Tenants",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsStock",
                table: "Tenants");
        }
    }
}
