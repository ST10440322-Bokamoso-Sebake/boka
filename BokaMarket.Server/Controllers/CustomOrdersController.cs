using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BokaMarket.Server.Data;
using BokaMarket.Shared;

namespace BokaMarket.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomOrdersController : ControllerBase
{
    private const decimal DepositPercent = 0.30m;
    private readonly AppDbContext _db;

    public CustomOrdersController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<CustomOrder>>> GetAll()
    {
        return await _db.CustomOrders.OrderByDescending(o => o.CreatedAt).ToListAsync();
    }

    [HttpGet("my")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<CustomOrder>>> GetMine()
    {
        var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(email)) return Unauthorized();

        return await _db.CustomOrders
            .Where(o => o.CustomerEmail == email)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CustomOrder>> Create(CustomOrder order)
    {
        var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(email)) return Unauthorized();

        order.Id = Guid.NewGuid();
        order.CustomerEmail = email;
        order.CustomerId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? email;
        order.CustomerName = User.Identity?.Name ?? order.CustomerName;
        order.Status = "pending_review";
        order.CreatedAt = DateTime.UtcNow;
        order.UpdatedAt = DateTime.UtcNow;

        _db.CustomOrders.Add(order);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = order.Id }, order);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CustomOrder>> Update(Guid id, CustomOrderAdminUpdate patch)
    {
        var order = await _db.CustomOrders.FindAsync(id);
        if (order == null) return NotFound();

        if (patch.QuotedPrice.HasValue) order.QuotedPrice = patch.QuotedPrice;
        if (patch.QuoteMessage != null) order.QuoteMessage = patch.QuoteMessage;
        if (patch.QuoteChannel != null) order.QuoteChannel = patch.QuoteChannel;
        if (patch.ProductionNotes != null) order.ProductionNotes = patch.ProductionNotes;

        if (!string.IsNullOrEmpty(patch.Status))
        {
            var err = ValidateStatusTransition(order, patch);
            if (err != null) return BadRequest(err);
            order.Status = patch.Status;
        }

        if (patch.EstimatedReadyDate.HasValue) order.EstimatedReadyDate = patch.EstimatedReadyDate;
        if (patch.EstimatedDeliveryDate.HasValue) order.EstimatedDeliveryDate = patch.EstimatedDeliveryDate;
        if (patch.WhyTimelineLong != null) order.WhyTimelineLong = patch.WhyTimelineLong;
        if (patch.RejectionReason != null) order.RejectionReason = patch.RejectionReason;

        order.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return Ok(order);
    }

    [HttpPost("{id}/pay-deposit")]
    [Authorize]
    public async Task<ActionResult<CustomOrder>> PayDeposit(Guid id, PayDepositRequest? request)
    {
        var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(email)) return Unauthorized();

        var order = await _db.CustomOrders.FindAsync(id);
        if (order == null) return NotFound();
        if (!string.Equals(order.CustomerEmail, email, StringComparison.OrdinalIgnoreCase))
            return Forbid();

        if (order.Status != "accepted_pending_deposit")
            return BadRequest("Deposit can only be paid when the order awaits deposit.");

        if (order.DepositPaid)
            return BadRequest("Deposit already paid.");

        if (!order.DepositAmount.HasValue || order.DepositAmount <= 0)
            return BadRequest("Deposit amount is not set on this order.");

        var now = DateTime.UtcNow;
        order.DepositPaid = true;
        order.DepositPaidAt = now;
        order.DepositNonRefundableAfter = now.AddHours(48);
        order.Status = "deposit_paid";
        order.UpdatedAt = now;

        await _db.SaveChangesAsync();
        return Ok(order);
    }

    [HttpPost("{id}/convert")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Order>> ConvertToOrder(Guid id)
    {
        var custom = await _db.CustomOrders.FindAsync(id);
        if (custom == null) return NotFound();

        if (custom.Status != "deposit_paid" && custom.Status != "in_production")
            return BadRequest("Convert after deposit is paid or when already in production.");

        var order = new Order
        {
            OrderNumber = $"CUS-{DateTime.UtcNow:yyyyMMdd}-{id.ToString()[..8].ToUpper()}",
            CustomerName = custom.CustomerName,
            CustomerEmail = custom.CustomerEmail,
            ShippingAddress = "Custom order — address TBC",
            Phone = "",
            Status = "In Production",
            OrderDate = DateTime.UtcNow,
            TotalAmount = custom.QuotedPrice ?? 0,
            DepositPaid = custom.DepositAmount ?? 0,
            IsFullyPaid = false,
            Items = new List<OrderItem>
            {
                new OrderItem
                {
                    ProductName = custom.LiveSummary,
                    UnitPrice = custom.QuotedPrice ?? 0,
                    Quantity = 1,
                },
            },
        };

        _db.Orders.Add(order);
        if (custom.Status == "deposit_paid")
        {
            custom.Status = "in_production";
            custom.UpdatedAt = DateTime.UtcNow;
        }
        await _db.SaveChangesAsync();
        return Ok(order);
    }

    private static string? ValidateStatusTransition(CustomOrder order, CustomOrderAdminUpdate patch)
    {
        var next = patch.Status!;
        if (next == "declined")
        {
            if (string.IsNullOrWhiteSpace(patch.RejectionReason))
                return "Rejection reason is required when declining.";
            return null;
        }

        if (next == "accepted_pending_deposit")
        {
            if (!order.QuotedPrice.HasValue && !patch.QuotedPrice.HasValue)
                return "Quoted price is required before accepting.";
            if (!patch.EstimatedReadyDate.HasValue)
                return "Estimated ready date is required when accepting.";
            if (!patch.EstimatedDeliveryDate.HasValue)
                return "Estimated delivery date is required when accepting.";
            if (string.IsNullOrWhiteSpace(patch.WhyTimelineLong))
                return "Please explain why the timeline will take this long.";

            var price = patch.QuotedPrice ?? order.QuotedPrice!.Value;
            order.DepositAmount = Math.Round(price * DepositPercent, 2);
            return null;
        }

        return null;
    }
}
