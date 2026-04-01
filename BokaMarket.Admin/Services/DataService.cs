using System.Net.Http.Json;
using BokaMarket.Shared;

namespace BokaMarket.Admin.Services;

public interface IDataService
{
    // Orders
    Task<List<Order>> GetOrdersAsync();
    Task SaveOrderAsync(Order order);
    Task UpdateOrderStatusAsync(int id, string status);

    // Products
    Task<List<Product>> GetProductsAsync();
    Task SaveProductAsync(Product product);
    Task DeleteProductAsync(int id);

    // Reviews
    Task<List<Review>> GetReviewsAsync();
    Task ApproveReviewAsync(int id);
    Task DeleteReviewAsync(int id);

    // Bulk Requests
    Task<List<BulkRequest>> GetBulkRequestsAsync();
    Task UpdateBulkStatusAsync(int id, string status);
    Task DeleteBulkRequestAsync(int id);

    // Invoices
    Task<List<Invoice>> GetInvoicesAsync();
    Task SaveInvoiceAsync(Invoice invoice);

    // Settings
    Task<AppSettings> GetSettingsAsync();
    Task SaveSettingsAsync(AppSettings settings);
    User? CurrentUser { get; }
}

public class HttpDataService : IDataService
{
    private readonly HttpClient _http;
    public User? CurrentUser { get; private set; }

    public HttpDataService(HttpClient http)
    {
        _http = http;
        CurrentUser = new User { FirstName = "Admin", Email = "admin@bokayarnmarket.co.za" };
    }

    public async Task<List<Product>> GetProductsAsync() => 
        await _http.GetFromJsonAsync<List<Product>>("api/products") ?? new();

    public async Task SaveProductAsync(Product product)
    {
        if (product.Id == 0) await _http.PostAsJsonAsync("api/products", product);
        else await _http.PutAsJsonAsync($"api/products/{product.Id}", product);
    }

    public async Task DeleteProductAsync(int id) => await _http.DeleteAsync($"api/products/{id}");

    public async Task<List<Order>> GetOrdersAsync() => 
        await _http.GetFromJsonAsync<List<Order>>("api/orders") ?? new();

    public async Task SaveOrderAsync(Order order) => await _http.PostAsJsonAsync("api/orders", order);

    public async Task UpdateOrderStatusAsync(int id, string status) => 
        await _http.PutAsJsonAsync($"api/orders/{id}/status", status);

    public async Task<List<Review>> GetReviewsAsync() => 
        await _http.GetFromJsonAsync<List<Review>>("api/reviews") ?? new();

    public async Task ApproveReviewAsync(int id) => await _http.PutAsync($"api/reviews/{id}/approve", null);

    public async Task DeleteReviewAsync(int id) => await _http.DeleteAsync($"api/reviews/{id}");

    public async Task<List<BulkRequest>> GetBulkRequestsAsync() => 
        await _http.GetFromJsonAsync<List<BulkRequest>>("api/bulk") ?? new();

    public async Task UpdateBulkStatusAsync(int id, string status) => 
        await _http.PutAsJsonAsync($"api/bulk/{id}/status", status);

    public async Task DeleteBulkRequestAsync(int id) => await _http.DeleteAsync($"api/bulk/{id}");

    public async Task<List<Invoice>> GetInvoicesAsync() => 
        await _http.GetFromJsonAsync<List<Invoice>>("api/invoices") ?? new();

    public async Task SaveInvoiceAsync(Invoice invoice) => await _http.PostAsJsonAsync("api/invoices", invoice);

    public async Task<AppSettings> GetSettingsAsync() => 
        await _http.GetFromJsonAsync<AppSettings>("api/settings") ?? new();

    public async Task SaveSettingsAsync(AppSettings settings) => 
        await _http.PutAsJsonAsync("api/settings", settings);
}
