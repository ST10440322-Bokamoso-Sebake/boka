using System.Net.Http.Json;
using System.Net.Http.Headers;
using BokaMarket.Shared;
using Blazored.LocalStorage;

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
    Task<CheckoutResponse> ProcessCheckoutAsync(CheckoutRequest request);
}

public class HttpDataService : IDataService
{
    private readonly HttpClient _http;
    private readonly ILocalStorageService _localStorage;
    public User? CurrentUser { get; private set; }

    public HttpDataService(HttpClient http, ILocalStorageService localStorage)
    {
        _http = http;
        _localStorage = localStorage;
    }

    private async Task AddAuthHeader()
    {
        var token = await _localStorage.GetItemAsync<string>("authToken");
        if (!string.IsNullOrEmpty(token))
        {
            _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }
    }

    public async Task<List<Product>> GetProductsAsync() 
    {
        await AddAuthHeader();
        return await _http.GetFromJsonAsync<List<Product>>("api/products") ?? new();
    }

    public async Task<Product?> GetProductAsync(int id) 
    {
        await AddAuthHeader();
        return await _http.GetFromJsonAsync<Product>($"api/products/{id}");
    }

    public async Task SaveProductAsync(Product product)
    {
        await AddAuthHeader();
        if (product.Id == 0) await _http.PostAsJsonAsync("api/products", product);
        else await _http.PutAsJsonAsync($"api/products/{product.Id}", product);
    }

    public async Task DeleteProductAsync(int id) 
    {
        await AddAuthHeader();
        await _http.DeleteAsync($"api/products/{id}");
    }

    public async Task<List<Order>> GetOrdersAsync() 
    {
        await AddAuthHeader();
        return await _http.GetFromJsonAsync<List<Order>>("api/orders") ?? new();
    }

    public async Task SaveOrderAsync(Order order) 
    {
        await AddAuthHeader();
        await _http.PostAsJsonAsync("api/orders", order);
    }

    public async Task UpdateOrderStatusAsync(int id, string status) 
    {
        await AddAuthHeader();
        await _http.PutAsJsonAsync($"api/orders/{id}/status", status);
    }

    public async Task<List<Review>> GetReviewsAsync() 
    {
        await AddAuthHeader();
        return await _http.GetFromJsonAsync<List<Review>>("api/reviews") ?? new();
    }

    public async Task ApproveReviewAsync(int id) 
    {
        await AddAuthHeader();
        await _http.PutAsync($"api/reviews/{id}/approve", null);
    }

    public async Task DeleteReviewAsync(int id) 
    {
        await AddAuthHeader();
        await _http.DeleteAsync($"api/reviews/{id}");
    }

    public async Task<AppSettings> GetSettingsAsync() 
    {
        await AddAuthHeader();
        return await _http.GetFromJsonAsync<AppSettings>("api/settings") ?? new();
    }

    public async Task SaveSettingsAsync(AppSettings settings) 
    {
        await AddAuthHeader();
        await _http.PutAsJsonAsync("api/settings", settings);
    }

    public async Task<bool> LoginAsync(string email, string password)
    {
        var result = await _http.PostAsJsonAsync("api/auth/login", new { email, password });
        if (result.IsSuccessStatusCode)
        {
            var authResponse = await result.Content.ReadFromJsonAsync<AuthResponse>();
            if (authResponse?.Success == true)
            {
                await _localStorage.SetItemAsync("authToken", authResponse.Token);
                return true;
            }
        }
        return false;
    }

    public void Logout() 
    {
        _localStorage.RemoveItemAsync("authToken");
        CurrentUser = null;
    }

    public async Task<bool> RegisterAsync(User user)
    {
        var response = await _http.PostAsJsonAsync("api/auth/register", user);
        return response.IsSuccessStatusCode;
    }

    public async Task UpdateProfileAsync(User user) 
    {
        await AddAuthHeader();
        await _http.PutAsJsonAsync("api/auth/profile", user);
    }

    public async Task<CheckoutResponse> ProcessCheckoutAsync(CheckoutRequest request)
    {
        await AddAuthHeader();
        var response = await _http.PostAsJsonAsync("api/checkouts", request);
        return await response.Content.ReadFromJsonAsync<CheckoutResponse>() ?? new CheckoutResponse { Success = false, Message = "Checkout failed" };
    }
}
