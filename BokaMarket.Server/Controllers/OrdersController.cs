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
        return await _db.Orders.ToListAsync();
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<Order>> GetOrder(int id)
    {
        var order = await _db.Orders.FindAsync(id);
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

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] string status)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order == null) return NotFound();
        
        order.Status = status;
        await _db.SaveChangesAsync();
        
        return NoContent();
    }
}
