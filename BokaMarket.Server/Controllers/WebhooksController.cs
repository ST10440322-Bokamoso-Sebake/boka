using Microsoft.AspNetCore.Mvc;
using BokaMarket.Shared;
using BokaMarket.Server.Data;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace BokaMarket.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WebhooksController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private readonly ILogger<WebhooksController> _logger;

    public WebhooksController(AppDbContext db, IConfiguration config, ILogger<WebhooksController> logger)
    {
        _db = db;
        _config = config;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> StripeWebhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var stripeSignature = Request.Headers["Stripe-Signature"];

        try
        {
            var stripeEvent = EventUtility.ConstructEvent(
                json,
                stripeSignature,
                _config["Stripe:WebhookSecret"]
            );

            if (stripeEvent.Type == "checkout.session.completed")
            {
                var session = stripeEvent.Data.Object as Stripe.Checkout.Session;
                if (session != null && session.Metadata != null && session.Metadata.TryGetValue("OrderNumber", out var orderNumber))
                {
                    var order = await _db.Orders.FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);
                    if (order != null)
                    {
                        order.Status = "Deposit Paid";
                        order.IsFullyPaid = session.PaymentStatus == "paid";
                        await _db.SaveChangesAsync();
                        _logger.LogInformation($"Successfully fulfilled artisanal commission: {orderNumber}");
                    }
                }
            }

            return Ok();
        }
        catch (StripeException ex)
        {
            _logger.LogError($"Stripe Webhook Exception: {ex.Message}");
            return BadRequest();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Fatal Webhook Error: {ex.Message}");
            return StatusCode(500);
        }
    }
}
