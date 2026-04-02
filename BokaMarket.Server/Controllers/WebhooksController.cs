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

    public WebhooksController(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
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
                var orderNumber = session.Metadata["OrderNumber"];

                var order = await _db.Orders.FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);
                if (order != null)
                {
                    order.Status = "Deposit Paid"; // Marking as paid
                    order.IsFullyPaid = true; // Assuming full payment for now
                    await _db.SaveChangesAsync();
                }
            }

            return Ok();
        }
        catch (StripeException e)
        {
            return BadRequest();
        }
    }
}
