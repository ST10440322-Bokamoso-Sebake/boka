using BokaMarket.Customer.Data;
using Microsoft.JSInterop;
using System.Text.Json;

namespace BokaMarket.Customer.Services;

public interface IDataService
{
    // Orders
    List<Order> GetOrders();
    void SaveOrder(Order order);
    void UpdateOrderStatus(int id, string status);

    // Products
    List<Product> GetProducts();
    void SaveProduct(Product product);
    void DeleteProduct(int id);

    // Reviews
    List<Review> GetReviews();
    void ApproveReview(int id);
    void DeleteReview(int id);

    // Bulk Requests
    List<BulkRequest> GetBulkRequests();
    void UpdateBulkStatus(int id, string status);
    void DeleteBulkRequest(int id);

    // Invoices
    List<Invoice> GetInvoices();
    void SaveInvoice(Invoice invoice);

    // Settings
    AppSettings GetSettings();
    void SaveSettings(AppSettings settings);

    // Authentication (Mock)
    User? CurrentUser { get; }
    bool Login(string email, string password);
    void Logout();
    bool Register(User user);
    void UpdateProfile(User user);
}

public class InMemoryDataService : IDataService
{
    private readonly IJSRuntime _js;
    private readonly List<Order> _orders;
    private readonly List<Product> _products;
    private readonly List<Review> _reviews;
    private readonly List<BulkRequest> _bulkRequests;
    private readonly List<Invoice> _invoices;
    private AppSettings _settings;
    
    // Auth State
    private List<User> _users;
    public User? CurrentUser { get; private set; }

    public InMemoryDataService(IJSRuntime js)
    {
        _js = js;
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

        _settings = new AppSettings();

        _users = new List<User>
        {
            new User { Id = 1, FirstName = "Lerato", LastName = "M.", Email = "lerato@demo.com", Password = "password", Phone = "0821234567", Address = "123 Fiber Street, Cape Town" }
        };
    }

    public List<Order> GetOrders() => _orders.OrderByDescending(o => o.OrderDate).ToList();
    public void SaveOrder(Order order)
    {
        if (order.Id == 0)
        {
            order.Id = _orders.Any() ? _orders.Max(o => o.Id) + 1 : 1;
            order.OrderNumber = $"#BYM-{9400 + order.Id}";
            _orders.Add(order);
        }
        else
        {
            var idx = _orders.FindIndex(o => o.Id == order.Id);
            if (idx >= 0) _orders[idx] = order;
        }
        ExportToTxt("SaveOrder", order);
    }
    public void UpdateOrderStatus(int id, string status)
    {
        var order = _orders.FirstOrDefault(o => o.Id == id);
        if (order != null) 
        {
            order.Status = status;
            ExportToTxt("UpdateOrderStatus", order);
        }
    }

    public List<Product> GetProducts() => _products.ToList();
    public void SaveProduct(Product product)
    {
        if (product.Id == 0)
        {
            product.Id = _products.Any() ? _products.Max(p => p.Id) + 1 : 1;
            _products.Add(product);
        }
        else
        {
            var idx = _products.FindIndex(p => p.Id == product.Id);
            if (idx >= 0) _products[idx] = product;
        }
        ExportToTxt("SaveProduct", product);
    }
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
    public void DeleteBulkRequest(int id) => _bulkRequests.RemoveAll(r => r.Id == id);

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
        ExportToTxt("SaveInvoice", invoice);
    }

    public AppSettings GetSettings() => _settings;
    public void SaveSettings(AppSettings settings)
    {
        _settings.StoreName = settings.StoreName;
        _settings.Tagline = settings.Tagline;
        _settings.ContactEmail = settings.ContactEmail;
        _settings.MarketLocation = settings.MarketLocation;
        _settings.MarketDate = settings.MarketDate;
        _settings.DepositPercent = settings.DepositPercent;
        _settings.LaybyWeeks = settings.LaybyWeeks;
        ExportToTxt("SaveSettings", _settings);
    }

    // Mock Auth Implementation
    public bool Login(string email, string password)
    {
        var user = _users.FirstOrDefault(u => u.Email.Equals(email, StringComparison.OrdinalIgnoreCase) && u.Password == password);
        if (user != null)
        {
            CurrentUser = user;
            return true;
        }
        return false;
    }

    public void Logout()
    {
        CurrentUser = null;
    }

    public bool Register(User user)
    {
        if (_users.Any(u => u.Email.Equals(user.Email, StringComparison.OrdinalIgnoreCase)))
            return false; // Email already taken

        user.Id = _users.Any() ? _users.Max(u => u.Id) + 1 : 1;
        _users.Add(user);
        CurrentUser = user; // auto-login
        ExportToTxt("UserRegistration", user);
        return true;
    }

    public void UpdateProfile(User user)
    {
        var existing = _users.FirstOrDefault(u => u.Id == user.Id);
        if (existing != null)
        {
            existing.FirstName = user.FirstName;
            existing.LastName = user.LastName;
            existing.Phone = user.Phone;
            existing.Address = user.Address;
            if (!string.IsNullOrEmpty(user.Password))
            {
                existing.Password = user.Password;
            }
            ExportToTxt("UpdateProfile", existing);
        }
    }

    private async void ExportToTxt(string action, object data)
    {
        try
        {
            var userName = CurrentUser?.FirstName ?? "Guest";
            string filename = $"Boka_{userName}_{action}_{DateTime.Now:yyyyMMdd_HHmmss}.txt";
            
            var options = new JsonSerializerOptions { WriteIndented = true };
            string json = JsonSerializer.Serialize(data, options);
            string fileContent = $"BOKA YARN MARKET LOG\nUser: {userName}\nAction: {action}\nTime: {DateTime.Now}\n\nDATA RECORD:\n{json}";
            
            await _js.InvokeVoidAsync("downloadFileFromText", filename, fileContent);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Export ERROR: {ex.Message}");
        }
    }
}
