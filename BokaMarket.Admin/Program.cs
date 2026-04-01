using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using BokaMarket.Admin.Components;
using BokaMarket.Admin.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// Configure HttpClient for the Admin dashboard to talk to the Backend API
builder.Services.AddScoped(sp => new HttpClient { 
    BaseAddress = new Uri("https://localhost:7123/") 
});

builder.Services.AddScoped<IDataService, HttpDataService>();

await builder.Build().RunAsync();
