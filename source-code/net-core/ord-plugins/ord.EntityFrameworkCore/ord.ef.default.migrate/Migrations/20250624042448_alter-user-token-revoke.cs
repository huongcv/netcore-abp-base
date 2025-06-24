using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ord.EfCore.Default.MigrateDb.Migrations
{
    /// <inheritdoc />
    public partial class alterusertokenrevoke : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RevokeReason",
                table: "UserAccessTokens",
                type: "varchar(200)",
                maxLength: 200,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "RevokedAt",
                table: "UserAccessTokens",
                type: "datetime(6)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RevokeReason",
                table: "UserAccessTokens");

            migrationBuilder.DropColumn(
                name: "RevokedAt",
                table: "UserAccessTokens");
        }
    }
}
