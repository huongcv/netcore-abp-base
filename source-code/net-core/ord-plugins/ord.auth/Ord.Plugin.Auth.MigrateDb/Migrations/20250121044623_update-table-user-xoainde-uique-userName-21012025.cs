using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ord.Plugin.Auth.MigrateDb.Migrations
{
    /// <inheritdoc />
    public partial class updatetableuserxoaindeuiqueuserName21012025 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_UserName_TenantId",
                table: "Users");

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserName_TenantId",
                table: "Users",
                columns: new[] { "UserName", "TenantId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_UserName_TenantId",
                table: "Users");

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserName_TenantId",
                table: "Users",
                columns: new[] { "UserName", "TenantId" },
                unique: true);
        }
    }
}
