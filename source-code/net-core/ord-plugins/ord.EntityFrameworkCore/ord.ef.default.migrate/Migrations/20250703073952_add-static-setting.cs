using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ord.EfCore.Default.MigrateDb.Migrations
{
    /// <inheritdoc />
    public partial class addstaticsetting : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsStatic",
                table: "settings",
                type: "tinyint(1)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsStatic",
                table: "settings");
        }
    }
}
