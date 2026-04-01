using System.Net.Http.Json;
using BokaMarket.Shared;

namespace BokaMarket.Customer.Services;

public interface IDataService
{
    // Orders
    Task<List<Order>> GetOrdersAsync();
    Task SaveOrderAsync(Order order);
    Task UpdateOrderStatusAsync(int id, string status);

    // Products
    Task<List<Product>> GetProductsAsync();
    Task<Product?> GetProductAsync(int id);
    Task SaveProductAsync(Product product);
    Task DeleteProductAsync(int id);

    // Reviews
    Task<List<Review>> GetReviewsAsync();
    Task ApproveReviewAsync(int id);
    Task DeleteReviewAsync(int id);

    // Settings
    Task<AppSettings> GetSettingsAsync();
    Task SaveSettingsAsync(AppSettings settings);

    // Authentication
    User? CurrentUser { get; }
    Task<bool> LoginAsync(string email, string password);
    void Logout();
    Task<bool> RegisterAsync(User user);
    Task UpdateProfileAsync(User user);
}

public class HttpDataService : IDataService
{
    private readonly HttpClient _http;
    public User? CurrentUser { get; private set; }

    public HttpDataService(HttpClient http)
    {
        _http = http;
    }

    public async Task<List<Product>> GetProductsAsync() => 
        await _http.GetFromJsonAsync<List<Product>>("api/products") ?? new();

    public async Task<Product?> GetProductAsync(int id) => 
        await _http.GetFromJsonAsync<Product>($"api/products/{id}");

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

    public async Task<AppSettings> GetSettingsAsync() => 
        await _http.GetFromJsonAsync<AppSettings>("api/settings") ?? new();

    public async Task SaveSettingsAsync(AppSettings settings) => 
        await _http.PutAsJsonAsync("api/settings", settings);

    public async Task<bool> LoginAsync(string email, string password)
    {
        var response = await _http.PostAsJsonAsync("api/auth/login", new { email, password });
        if (response.IsSuccessStatusCode)
        {
            CurrentUser = await response.Content.ReadFromJsonAsync<User>();
            return true;
        }
        return false;
    }

    public void Logout() => CurrentUser = null;

    public async Task<bool> RegisterAsync(User user)
    {
        var response = await _http.PostAsJsonAsync("api/auth/register", user);
        if (response.IsSuccessStatusCode)
        {
            CurrentUser = await response.Content.ReadFromJsonAsync<User>();
            return true;
        }
        return false;
    }

    public async Task UpdateProfileAsync(User user) => await _http.PutAsJsonAsync("api/auth/profile", user);
}
