using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ord.Plugin.Auth.MigrateDb.Migrations
{
    /// <inheritdoc />
    public partial class updatetenant10042025 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<short>(
                name: "Type",
                table: "Tenants",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Tenants");
        }
    }
}
