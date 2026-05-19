using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BokaMarket.Server.Migrations
{
    /// <inheritdoc />
    public partial class CustomOrderDepositFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CustomOrders",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CustomerId = table.Column<string>(type: "text", nullable: false),
                    CustomerEmail = table.Column<string>(type: "text", nullable: false),
                    CustomerName = table.Column<string>(type: "text", nullable: false),
                    BuilderJson = table.Column<string>(type: "text", nullable: false),
                    LiveSummary = table.Column<string>(type: "text", nullable: false),
                    InspirationImageUrl = table.Column<string>(type: "text", nullable: true),
                    SketchDataUrl = table.Column<string>(type: "text", nullable: true),
                    CustomerNotes = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    QuotedPrice = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    QuoteMessage = table.Column<string>(type: "text", nullable: true),
                    QuoteChannel = table.Column<string>(type: "text", nullable: true),
                    RejectionReason = table.Column<string>(type: "text", nullable: true),
                    EstimatedReadyDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EstimatedDeliveryDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ProductionNotes = table.Column<string>(type: "text", nullable: true),
                    WhyTimelineLong = table.Column<string>(type: "text", nullable: true),
                    DepositAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    DepositPaid = table.Column<bool>(type: "boolean", nullable: false),
                    DepositPaidAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DepositNonRefundableAfter = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomOrders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "YarnColors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Slug = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Hex = table.Column<string>(type: "text", nullable: false),
                    InStock = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YarnColors", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "YarnColors",
                columns: new[] { "Id", "Hex", "InStock", "Name", "Slug" },
                values: new object[,]
                {
                    { 1, "#9B59B6", true, "Lavender Dream", "lavender" },
                    { 2, "#6B8F71", true, "Sage Meadow", "sage" },
                    { 3, "#F5F0E8", true, "Natural Cream", "cream" },
                    { 4, "#C97B4A", true, "Terracotta Clay", "terracotta" },
                    { 5, "#7E3091", true, "Deep Plum", "plum" },
                    { 6, "#E8B4B8", true, "Blush Pink", "blush" },
                    { 7, "#4A4A4A", true, "Charcoal", "charcoal" },
                    { 8, "#E67E22", false, "Sunset Orange", "sunset" },
                    { 9, "#1ABC9C", true, "Ocean Teal", "ocean" },
                    { 10, "#D4A017", true, "Mustard Gold", "mustard" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CustomOrders");

            migrationBuilder.DropTable(
                name: "YarnColors");
        }
    }
}
