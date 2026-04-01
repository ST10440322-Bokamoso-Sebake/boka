using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using BokaMarket.Customer;
using BokaMarket.Customer.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// Configure HttpClient to talk to the Backend API
// For production, this should be the live URL. For local dev, use the API URL.
builder.Services.AddScoped(sp => new HttpClient { 
    BaseAddress = new Uri("https://localhost:7123/") 
});

builder.Services.AddScoped<IDataService, HttpDataService>();

await builder.Build().RunAsync();
