using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BokaMarket.Server.Data;
using BokaMarket.Shared;
using Microsoft.AspNetCore.Authorization;

namespace BokaMarket.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;

    public OrdersController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {
        return await _db.Orders.Include(o => o.Items).ToListAsync();
    }

    [HttpGet("my")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<Order>>> GetMyOrders()
    {
        var email = User.Identity?.Name;
        if (string.IsNullOrEmpty(email)) return Unauthorized();

        return await _db.Orders
            .Include(o => o.Items)
            .Where(o => o.CustomerEmail == email)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<Order>> GetOrder(int id)
    {
        var order = await _db.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id);
        if (order == null) return NotFound();
        return order;
    }

    [HttpPost]
    public async Task<ActionResult<Order>> PostOrder(Order order)
    {
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateOrder(int id, Order order)
    {
        if (id != order.Id) return BadRequest();
        
        var existingOrder = await _db.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id);
        if (existingOrder == null) return NotFound();

        existingOrder.Status = order.Status;
        existingOrder.IsFullyPaid = order.IsFullyPaid;
        existingOrder.DepositPaid = order.DepositPaid;
        existingOrder.TrackingNumber = order.TrackingNumber;
        existingOrder.CourierName = order.CourierName;

        await _db.SaveChangesAsync();
        return NoContent();
    }
}
