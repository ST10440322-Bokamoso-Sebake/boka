using System.Net.Http.Json;
using System.Net.Http.Headers;
using BokaMarket.Shared;
using Blazored.LocalStorage;

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
    Task<string?> UploadImageAsync(Stream fileStream, string fileName);
    User? CurrentUser { get; }
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

    public async Task<string?> UploadImageAsync(Stream fileStream, string fileName)
    {
        await AddAuthHeader();
        var content = new MultipartFormDataContent();
        var streamContent = new StreamContent(fileStream);
        content.Add(streamContent, "file", fileName);

        var response = await _http.PostAsync("api/uploads", content);
        if (response.IsSuccessStatusCode)
        {
            var result = await response.Content.ReadFromJsonAsync<UploadResult>();
            return result?.Url;
        }
        return null;
    }

    private class UploadResult { public string? Url { get; set; } }

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

    public async Task<List<BulkRequest>> GetBulkRequestsAsync() 
    {
        await AddAuthHeader();
        return await _http.GetFromJsonAsync<List<BulkRequest>>("api/bulk") ?? new();
    }

    public async Task UpdateBulkStatusAsync(int id, string status) 
    {
        await AddAuthHeader();
        await _http.PutAsJsonAsync($"api/bulk/{id}/status", status);
    }

    public async Task DeleteBulkRequestAsync(int id) 
    {
        await AddAuthHeader();
        await _http.DeleteAsync($"api/bulk/{id}");
    }

    public async Task<List<Invoice>> GetInvoicesAsync() 
    {
        await AddAuthHeader();
        return await _http.GetFromJsonAsync<List<Invoice>>("api/invoices") ?? new();
    }

    public async Task SaveInvoiceAsync(Invoice invoice) 
    {
        await AddAuthHeader();
        await _http.PostAsJsonAsync("api/invoices", invoice);
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
}
