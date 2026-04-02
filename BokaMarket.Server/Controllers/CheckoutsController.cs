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
        try
        {
            if (request.Items == null || !request.Items.Any())
            {
                return BadRequest(new CheckoutResponse { Success = false, Message = "Cart is empty." });
            }

            // 1. Create a real Order in the database
            var order = new Order
            {
                OrderNumber = $"BKA-{DateTime.Now.Ticks.ToString().Substring(10)}",
                CustomerName = request.CustomerName,
                CustomerEmail = request.CustomerEmail,
                ShippingAddress = request.ShippingAddress,
                Phone = request.Phone,
                Status = "Awaiting Payment",
                OrderDate = DateTime.Now,
                IsFullyPaid = false
            };

            decimal calculatedTotal = 0;

            // 2. Add line items and update inventory with SERVER-SIDE validation
            foreach (var item in request.Items)
            {
                var dbProduct = await _db.Products.FindAsync(item.ProductId);
                if (dbProduct == null) 
                    return BadRequest(new CheckoutResponse { Success = false, Message = $"Product {item.Name} no longer exists." });

                if (dbProduct.InventoryCount < item.Quantity)
                    return BadRequest(new CheckoutResponse { Success = false, Message = $"Insufficient stock for {dbProduct.Name}. Available: {dbProduct.InventoryCount}" });

                var lineTotal = dbProduct.Price * item.Quantity;
                calculatedTotal += lineTotal;

                order.Items.Add(new OrderItem
                {
                    ProductId = item.ProductId,
                    ProductName = dbProduct.Name,
                    UnitPrice = dbProduct.Price,
                    Quantity = item.Quantity
                });

                // Decrement inventory
                dbProduct.InventoryCount -= item.Quantity;
            }

            order.TotalAmount = calculatedTotal;

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            // 3. Create Stripe Checkout Session
            var domain = _config["Stripe:AppUrl"];
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = order.Items.Select(item => new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmount = (long)(item.UnitPrice * 100), // Stripe uses cents
                        Currency = "zar",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = item.ProductName,
                            Description = "Handcrafted Artisanal BokaMarket commission.",
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
                Message = "Artisanal commission verified. Redirecting to payment...",
                OrderNumber = order.OrderNumber,
                PaymentUrl = session.Url
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new CheckoutResponse { Success = false, Message = $"Checkout Error: {ex.Message}" });
        }
    }
}
