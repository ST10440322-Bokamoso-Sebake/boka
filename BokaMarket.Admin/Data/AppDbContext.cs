using Microsoft.EntityFrameworkCore;

namespace BokaMarket.Admin.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products { get; set; } = null!;
    public DbSet<Order> Orders { get; set; } = null!;
    public DbSet<Review> Reviews { get; set; } = null!;
    public DbSet<BulkRequest> BulkRequests { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Seed some data for initial demo
        modelBuilder.Entity<Order>().HasData(
            new Order { Id = 1, OrderNumber = "#BYM-9402", CustomerName = "Elena Rodriguez", CustomerEmail = "elena.r@example.com", Status = "In Production", TotalAmount = 450, DepositPaid = 45, IsFullyPaid = false, OrderDate = DateTime.Now.AddDays(-2) },
            new Order { Id = 2, OrderNumber = "#BYM-9408", CustomerName = "Marcus Thorne", CustomerEmail = "marcus.t@example.com", Status = "Ready for Pickup", TotalAmount = 120, DepositPaid = 120, IsFullyPaid = true, OrderDate = DateTime.Now.AddDays(-1) },
            new Order { Id = 3, OrderNumber = "#BYM-9412", CustomerName = "Sarah Chen", CustomerEmail = "schen@domain.com", Status = "Deposit Paid", TotalAmount = 200, DepositPaid = 200, IsFullyPaid = true, OrderDate = DateTime.Now.AddDays(-0.5) },
            new Order { Id = 4, OrderNumber = "#BYM-9415", CustomerName = "Oliver James", CustomerEmail = "o.james@web.com", Status = "In Production", TotalAmount = 300, DepositPaid = 30, IsFullyPaid = false, OrderDate = DateTime.Now.AddDays(-0.1) }
        );

        modelBuilder.Entity<Product>().HasData(
            new Product { Id = 1, Name = "Chunky Merino Cardigan", Description = "Hand-knitted lavender wool.", Price = 450, InventoryCount = 12, Category = "Clothing" },
            new Product { Id = 2, Name = "Macramé Wall Hanging", Description = "Oatmeal cotton fiber art.", Price = 120, InventoryCount = 5, Category = "Home Decor" }
        );
    }
}
