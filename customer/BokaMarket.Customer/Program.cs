using BokaMarket.Customer.Services;
using BokaMarket.Shared;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Blazored.LocalStorage;
using BokaMarket.Customer;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddBlazoredLocalStorage();
builder.Services.AddAuthorizationCore();
builder.Services.AddScoped<AuthenticationStateProvider, CustomAuthenticationStateProvider>();
builder.Services.AddScoped<CustomAuthenticationStateProvider>(); // Registered for direct access

// Configure HttpClient to talk to the Backend API
builder.Services.AddScoped(sp => 
{
    var config = sp.GetRequiredService<IConfiguration>();
    var baseUrl = config["ApiBaseUrl"] ?? "https://localhost:7123/";
    if (!baseUrl.EndsWith("/")) baseUrl += "/";
    return new HttpClient { BaseAddress = new Uri(baseUrl) };
});

builder.Services.AddScoped<IDataService, HttpDataService>();
builder.Services.AddScoped<CartService>();

await builder.Build().RunAsync();
