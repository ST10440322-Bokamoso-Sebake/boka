using BokaMarket.Admin.Data;

namespace BokaMarket.Admin.Services;

public interface IDataService
{
    // Orders
    List<Order> GetOrders();
    void UpdateOrderStatus(int id, string status);

    // Products
    List<Product> GetProducts();
    void DeleteProduct(int id);

    // Reviews
    List<Review> GetReviews();
    void ApproveReview(int id);
    void DeleteReview(int id);

    // Bulk Requests
    List<BulkRequest> GetBulkRequests();
    void UpdateBulkStatus(int id, string status);

    // Invoices
    List<Invoice> GetInvoices();
    void SaveInvoice(Invoice invoice);
}

public class InMemoryDataService : IDataService
{
    private readonly List<Order> _orders;
    private readonly List<Product> _products;
    private readonly List<Review> _reviews;
    private readonly List<BulkRequest> _bulkRequests;
    private readonly List<Invoice> _invoices;

    public InMemoryDataService()
    {
        _orders = new List<Order>
        {
            new() { Id = 1, OrderNumber = "#BYM-9402", CustomerName = "Elena Rodriguez", CustomerEmail = "elena.r@example.com", Status = "In Production",   TotalAmount = 450, DepositPaid = 45,  IsFullyPaid = false, OrderDate = DateTime.Now.AddDays(-2)   },
            new() { Id = 2, OrderNumber = "#BYM-9408", CustomerName = "Marcus Thorne",   CustomerEmail = "marcus.t@example.com", Status = "Ready for Pickup", TotalAmount = 120, DepositPaid = 120, IsFullyPaid = true,  OrderDate = DateTime.Now.AddDays(-1)   },
            new() { Id = 3, OrderNumber = "#BYM-9412", CustomerName = "Sarah Chen",      CustomerEmail = "schen@domain.com",     Status = "Deposit Paid",    TotalAmount = 200, DepositPaid = 200, IsFullyPaid = true,  OrderDate = DateTime.Now.AddDays(-0.5) },
            new() { Id = 4, OrderNumber = "#BYM-9415", CustomerName = "Oliver James",    CustomerEmail = "o.james@web.com",      Status = "In Production",   TotalAmount = 300, DepositPaid = 30,  IsFullyPaid = false, OrderDate = DateTime.Now.AddDays(-0.1) },
        };

        _products = new List<Product>
        {
            new() { Id = 1, Name = "Chunky Merino Cardigan",   Description = "Hand-knitted lavender wool.",     Price = 450, InventoryCount = 12, Category = "Clothing"   },
            new() { Id = 2, Name = "Macramé Wall Hanging",     Description = "Oatmeal cotton fiber art.",       Price = 120, InventoryCount = 5,  Category = "Home Decor" },
            new() { Id = 3, Name = "Hand-Dyed Cotton Yarn",    Description = "100g skein, botanical colours.",  Price = 85,  InventoryCount = 34, Category = "Yarn"       },
            new() { Id = 4, Name = "Bamboo Crochet Hook Set",  Description = "Ergonomic sizes 2–6mm.",          Price = 35,  InventoryCount = 20, Category = "Tools"      },
        };

        _reviews = new List<Review>
        {
            new() { Id = 1, CustomerName = "Lerato M.",  Comment = "Absolutely beautiful! The cardigan is soft and the colour is perfect.",       Rating = 5, IsApproved = false, Date = DateTime.Now.AddDays(-1) },
            new() { Id = 2, CustomerName = "Sipho D.",   Comment = "Good quality but delivery took longer than expected.",                         Rating = 3, IsApproved = false, Date = DateTime.Now.AddDays(-3) },
            new() { Id = 3, CustomerName = "Amara K.",   Comment = "The macramé wall hanging is a masterpiece — everyone who sees it wants one!", Rating = 5, IsApproved = true,  Date = DateTime.Now.AddDays(-5) },
        };

        _bulkRequests = new List<BulkRequest>
        {
            new() { Id = 1, Organization = "Afri-Faire Co.",         ContactPerson = "Naledi G.", Item = "Hand-dyed Cotton Yarn (50g)", Quantity = 200, Status = "Pending"        },
            new() { Id = 2, Organization = "Cape Handcraft Studio",   ContactPerson = "Johan B.", Item = "Crochet Baby Blankets",       Quantity = 50,  Status = "In Negotiation" },
            new() { Id = 3, Organization = "Langa Gift Shop",         ContactPerson = "Thabo N.", Item = "Macramé Wall Hangings",       Quantity = 30,  Status = "Confirmed"      },
        };

        _invoices = new List<Invoice>
        {
            new()
            {
                Id = 1,
                InvoiceNumber = "#INV-2023-9821",
                CustomerName = "Elara Thorne",
                CustomerAddress = "45 Artisan Way, Apt 4C\nWillow Creek, OR 97001",
                IssueDate = new DateTime(2023, 10, 24),
                DueDate = new DateTime(2023, 11, 7),
                VatRate = 0.15m,
                DiscountRate = 0.10m,
                Items = new List<InvoiceItem>
                {
                    new() { Name = "Hand-Dyed Merino Wool", Description = "Sage Green, 100g Skein",    Qty = 4, UnitPrice = 22 },
                    new() { Name = "Bamboo Crochet Hook Set", Description = "Ergonomic sizes 2-6mm",   Qty = 1, UnitPrice = 35 },
                }
            }
        };
    }

    public List<Order> GetOrders() => _orders.OrderByDescending(o => o.OrderDate).ToList();
    public void UpdateOrderStatus(int id, string status)
    {
        var order = _orders.FirstOrDefault(o => o.Id == id);
        if (order != null) order.Status = status;
    }

    public List<Product> GetProducts() => _products.ToList();
    public void DeleteProduct(int id) => _products.RemoveAll(p => p.Id == id);

    public List<Review> GetReviews() => _reviews.OrderByDescending(r => r.Date).ToList();
    public void ApproveReview(int id)
    {
        var review = _reviews.FirstOrDefault(r => r.Id == id);
        if (review != null) review.IsApproved = true;
    }
    public void DeleteReview(int id) => _reviews.RemoveAll(r => r.Id == id);

    public List<BulkRequest> GetBulkRequests() => _bulkRequests.ToList();
    public void UpdateBulkStatus(int id, string status)
    {
        var req = _bulkRequests.FirstOrDefault(r => r.Id == id);
        if (req != null) req.Status = status;
    }

    public List<Invoice> GetInvoices() => _invoices.ToList();
    public void SaveInvoice(Invoice invoice)
    {
        if (invoice.Id == 0)
        {
            invoice.Id = _invoices.Count + 1;
            invoice.InvoiceNumber = $"#INV-{DateTime.Now.Year}-{1000 + invoice.Id}";
            _invoices.Add(invoice);
        }
        else
        {
            var idx = _invoices.FindIndex(i => i.Id == invoice.Id);
            if (idx >= 0) _invoices[idx] = invoice;
        }
    }
}
