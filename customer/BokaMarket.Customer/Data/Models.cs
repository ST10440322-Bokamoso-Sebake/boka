using System.ComponentModel.DataAnnotations;

namespace BokaMarket.Customer.Data;

public class Product
{
    public int Id { get; set; }
    [Required] public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int InventoryCount { get; set; }
    public string ImageUrl { get; set; } = "https://placehold.co/60x60/e9e9e9/888?text=IMG";
    public string Category { get; set; } = "Yarn";
}

public class Order
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string Status { get; set; } = "In Production";
    public DateTime OrderDate { get; set; } = DateTime.Now;
    public decimal TotalAmount { get; set; }
    public decimal DepositPaid { get; set; }
    public bool IsFullyPaid { get; set; }
}

public class Review
{
    public int Id { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    public int Rating { get; set; }
    public bool IsApproved { get; set; }
    public DateTime Date { get; set; } = DateTime.Now;
}

public class BulkRequest
{
    public int Id { get; set; }
    public string Organization { get; set; } = string.Empty;
    public string ContactPerson { get; set; } = string.Empty;
    public string Item { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public string Status { get; set; } = "Pending";
}

public class InvoiceItem
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Qty { get; set; } = 1;
    public decimal UnitPrice { get; set; }
    public decimal Total => Qty * UnitPrice;
}

public class Invoice
{
    public int Id { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerAddress { get; set; } = string.Empty;
    public DateTime IssueDate { get; set; } = DateTime.Today;
    public DateTime DueDate { get; set; } = DateTime.Today.AddDays(14);
    public string DiscountCode { get; set; } = string.Empty;
    public decimal VatRate { get; set; } = 0.15m;
    public decimal DiscountRate { get; set; } = 0m;
    public List<InvoiceItem> Items { get; set; } = new();

    public decimal Subtotal => Items.Sum(i => i.Total);
    public decimal VatAmount => Subtotal * VatRate;
    public decimal DiscountAmount => Subtotal * DiscountRate;
    public decimal Total => Subtotal + VatAmount - DiscountAmount;
}

public class AppSettings
{
    public string StoreName { get; set; } = "Boka's Yarn Market";
    public string Tagline { get; set; } = "Crafting Slowly, Living Intentionally.";
    public string ContactEmail { get; set; } = "hello@bokayarnmarket.co.za";
    public string MarketLocation { get; set; } = "Neighbourgoods Market, Woodstock";
    public DateTime MarketDate { get; set; } = new DateTime(2026, 3, 21);
    public int DepositPercent { get; set; } = 30;
    public int LaybyWeeks { get; set; } = 4;
}
