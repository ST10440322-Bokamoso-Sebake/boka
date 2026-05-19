using Microsoft.EntityFrameworkCore;
using BokaMarket.Shared;

namespace BokaMarket.Server.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<BulkRequest> BulkRequests { get; set; }
    public DbSet<Invoice> Invoices { get; set; }
    public DbSet<AppSettings> Settings { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<CustomOrder> CustomOrders { get; set; }
    public DbSet<YarnColorStock> YarnColors { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Seed some products
        modelBuilder.Entity<Product>().HasData(
            new Product { 
                Id = 1, Name = "Lavender Dream Cardigan", 
                Description = "Luxury handcrafted lavender crochet cardigan made with premium soft yarn. Slow fashion at its best.", 
                Price = 1200, InventoryCount = 5, Category = "Crochet Fashion", 
                ImageUrl = "/images/crochet_cardigan_lavender.png" 
            },
            new Product { 
                Id = 2, Name = "Artisanal wall Hanging", 
                Description = "Cream cotton rope macramé wall hanging. Perfect for minimalist and boho-chic home interiors.", 
                Price = 850, InventoryCount = 3, Category = "Home Decor", 
                ImageUrl = "/images/macrame_wall_hanging_cream.png" 
            },
            new Product { 
                Id = 3, Name = "Sage Heritage Sweater", 
                Description = "Oversized, chunky hand-knitted sage wool sweater. Heirloom quality piece to pass through generations.", 
                Price = 1500, InventoryCount = 2, Category = "Knitted Wear", 
                ImageUrl = "/images/sage_knit_sweater.png" 
            },
            new Product { 
                Id = 4, Name = "Hand-Dyed Merino Skein", 
                Description = "100g of pure, hand-dyed merino wool in botanical shades of forest green and rust.", 
                Price = 250, InventoryCount = 25, Category = "Supplies & Yarn", 
                ImageUrl = "https://placehold.co/600x600/F7E8FA/7E3091?text=Merino+Yarn" 
            }
        );

        // Seed default Admin 
        modelBuilder.Entity<User>().HasData(
            new User { 
                Id = 1, FirstName = "Admin", LastName = "Boka", 
                Email = "admin@bokayarnmarket.co.za", 
                // "admin_password_2026" hashed with BCrypt
                Password = " $2a$11$f7z/GjRrYtZ.X7Wk5bZ6O.vP3A1cW1v8fO7g1v5gO8fO7g1v5gO8f", 
                Phone = "000-000-0000", Address = "Cape Town, South Africa" 
            }
        );

        // Seed dynamic settings
        modelBuilder.Entity<AppSettings>().HasData(
            new AppSettings { 
                Id = 1, StoreName = "Boka Yarn Market", 
                Tagline = "Crafting Slowly, Living Intentionally.", 
                ContactEmail = "hello@bokayarnmarket.co.za", 
                MarketLocation = "Neighbourgoods Market, Woodstock", 
                MarketDate = new DateTime(2026, 3, 21, 0, 0, 0, DateTimeKind.Utc), 
                DepositPercent = 30, LaybyWeeks = 4 
            }
        );

        modelBuilder.Entity<CustomOrder>(e =>
        {
            e.Property(o => o.QuotedPrice).HasPrecision(18, 2);
            e.Property(o => o.DepositAmount).HasPrecision(18, 2);
        });

        modelBuilder.Entity<YarnColorStock>().HasData(
            new YarnColorStock { Id = 1, Slug = "lavender", Name = "Lavender Dream", Hex = "#9B59B6", InStock = true },
            new YarnColorStock { Id = 2, Slug = "sage", Name = "Sage Meadow", Hex = "#6B8F71", InStock = true },
            new YarnColorStock { Id = 3, Slug = "cream", Name = "Natural Cream", Hex = "#F5F0E8", InStock = true },
            new YarnColorStock { Id = 4, Slug = "terracotta", Name = "Terracotta Clay", Hex = "#C97B4A", InStock = true },
            new YarnColorStock { Id = 5, Slug = "plum", Name = "Deep Plum", Hex = "#7E3091", InStock = true },
            new YarnColorStock { Id = 6, Slug = "blush", Name = "Blush Pink", Hex = "#E8B4B8", InStock = true },
            new YarnColorStock { Id = 7, Slug = "charcoal", Name = "Charcoal", Hex = "#4A4A4A", InStock = true },
            new YarnColorStock { Id = 8, Slug = "sunset", Name = "Sunset Orange", Hex = "#E67E22", InStock = false },
            new YarnColorStock { Id = 9, Slug = "ocean", Name = "Ocean Teal", Hex = "#1ABC9C", InStock = true },
            new YarnColorStock { Id = 10, Slug = "mustard", Name = "Mustard Gold", Hex = "#D4A017", InStock = true }
        );
    }
}
