using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ord.Plugin.Auth.MigrateDb.Migrations
{
    /// <inheritdoc />
    public partial class settingjobject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "JObjectValue",
                table: "Settings",
                type: "json",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "JObjectValue",
                table: "Settings");
        }
    }
}
