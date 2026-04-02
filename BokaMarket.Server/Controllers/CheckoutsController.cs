using Microsoft.AspNetCore.Mvc;
using BokaMarket.Shared;
using BokaMarket.Server.Data;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Stripe.Checkout;

namespace BokaMarket.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CheckoutsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public CheckoutsController(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
        StripeConfiguration.ApiKey = _config["Stripe:ApiKey"];
    }

    [HttpPost]
    public async Task<ActionResult<CheckoutResponse>> ProcessCheckout(CheckoutRequest request)
    {
        if (request.Items == null || !request.Items.Any())
        {
            return BadRequest(new CheckoutResponse { Success = false, Message = "Cart is empty." });
        }

        // 1. Create a real Order in the database
        var order = new Order
        {
            OrderNumber = $"BYM-{DateTime.Now.Ticks.ToString().Substring(10)}",
            CustomerName = request.CustomerName,
            CustomerEmail = request.CustomerEmail,
            ShippingAddress = request.ShippingAddress,
            Phone = request.Phone,
            TotalAmount = request.TotalAmount,
            Status = "Awaiting Payment",
            OrderDate = DateTime.Now,
            IsFullyPaid = false
        };

        // 2. Add line items and update inventory
        foreach (var item in request.Items)
        {
            order.Items.Add(new OrderItem
            {
                ProductId = item.ProductId,
                ProductName = item.Name,
                UnitPrice = item.Price,
                Quantity = item.Quantity
            });

            // Decrement inventory
            var product = await _db.Products.FindAsync(item.ProductId);
            if (product != null)
            {
                product.InventoryCount -= item.Quantity;
                if (product.InventoryCount < 0) product.InventoryCount = 0; // Simple guard
            }
        }

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        // 2. Create Stripe Checkout Session
        var domain = _config["Stripe:AppUrl"];
        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string> { "card" },
            LineItems = request.Items.Select(item => new SessionLineItemOptions
            {
                PriceData = new SessionLineItemPriceDataOptions
                {
                    UnitAmount = (long)(item.Price * 100), // Stripe uses cents
                    Currency = "zar",
                    ProductData = new SessionLineItemPriceDataProductDataOptions
                    {
                        Name = item.Name,
                        Description = "Artisanal BokaMarket Treasure",
                        Images = new List<string> { item.ImageUrl }
                    },
                },
                Quantity = item.Quantity,
            }).ToList(),
            Mode = "payment",
            SuccessUrl = $"{domain}/checkout/success/{order.OrderNumber}",
            CancelUrl = $"{domain}/checkout?canceled=true",
            CustomerEmail = request.CustomerEmail,
            Metadata = new Dictionary<string, string>
            {
                { "OrderNumber", order.OrderNumber }
            }
        };

        var service = new SessionService();
        Session session = await service.CreateAsync(options);

        return Ok(new CheckoutResponse
        {
            Success = true,
            Message = "Redirecting to secure payment...",
            OrderNumber = order.OrderNumber,
            PaymentUrl = session.Url
        });
    }
}
