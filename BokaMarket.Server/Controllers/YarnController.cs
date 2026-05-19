using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BokaMarket.Server.Data;
using BokaMarket.Shared;

namespace BokaMarket.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class YarnController : ControllerBase
{
    private readonly AppDbContext _db;

    public YarnController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<YarnColorStock>>> GetColors()
    {
        return await _db.YarnColors.OrderBy(y => y.Id).ToListAsync();
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStock(int id, YarnColorStock patch)
    {
        var yarn = await _db.YarnColors.FindAsync(id);
        if (yarn == null) return NotFound();
        yarn.InStock = patch.InStock;
        yarn.Name = patch.Name;
        yarn.Hex = patch.Hex;
        await _db.SaveChangesAsync();
        return Ok(yarn);
    }
}
