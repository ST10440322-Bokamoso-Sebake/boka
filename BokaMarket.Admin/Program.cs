using Blazored.LocalStorage;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using BokaMarket.Shared;
using BokaMarket.Admin;
using BokaMarket.Admin.Components;
using BokaMarket.Admin.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddBlazoredLocalStorage();
builder.Services.AddAuthorizationCore();
builder.Services.AddScoped<AuthenticationStateProvider, CustomAuthenticationStateProvider>();

// Configure HttpClient for the Admin dashboard to talk to the Backend API
builder.Services.AddScoped(sp => new HttpClient { 
    BaseAddress = sp.GetRequiredService<IConfiguration>()["ApiBaseUrl"] != null ? 
        new Uri(sp.GetRequiredService<IConfiguration>()["ApiBaseUrl"]!) : 
        new Uri("https://localhost:7123/") 
});

builder.Services.AddScoped<IDataService, HttpDataService>();

await builder.Build().RunAsync();
