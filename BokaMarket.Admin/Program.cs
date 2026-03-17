using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using BokaMarket.Admin.Components;
using BokaMarket.Admin.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// Register the in-memory data service
builder.Services.AddScoped<IDataService, InMemoryDataService>();

await builder.Build().RunAsync();
