using BokaMarket.Shared;
using Blazored.LocalStorage;

namespace BokaMarket.Customer.Services;

public class CartService
{
    private readonly ILocalStorageService _localStorage;
    private List<CartItem> _cart = new();

    public event Action? OnChange;

    public CartService(ILocalStorageService localStorage)
    {
        _localStorage = localStorage;
    }

    public async Task AddToCartAsync(Product product, int quantity = 1)
    {
        await LoadCartAsync();
        var item = _cart.FirstOrDefault(i => i.ProductId == product.Id);
        if (item == null)
        {
            _cart.Add(new CartItem 
            { 
                ProductId = product.Id, 
                Name = product.Name, 
                Price = product.Price, 
                ImageUrl = product.ImageUrl,
                Quantity = quantity 
            });
        }
        else
        {
            item.Quantity += quantity;
        }

        await SaveCartAsync();
    }

    public async Task<List<CartItem>> GetCartAsync()
    {
        await LoadCartAsync();
        return _cart;
    }

    public async Task RemoveItemAsync(int productId)
    {
        await LoadCartAsync();
        var item = _cart.FirstOrDefault(i => i.ProductId == productId);
        if (item != null)
        {
            _cart.Remove(item);
            await SaveCartAsync();
        }
    }

    public async Task ClearCartAsync()
    {
        _cart.Clear();
        await SaveCartAsync();
    }

    public decimal GetTotal() => _cart.Sum(i => i.Total);

    private async Task LoadCartAsync()
    {
        var cart = await _localStorage.GetItemAsync<List<CartItem>>("cart");
        if (cart != null)
        {
            _cart = cart;
        }
    }

    private async Task SaveCartAsync()
    {
        await _localStorage.SetItemAsync("cart", _cart);
        NotifyStateChanged();
    }

    private void NotifyStateChanged() => OnChange?.Invoke();
}
