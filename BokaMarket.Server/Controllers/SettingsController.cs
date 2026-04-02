using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BokaMarket.Server.Data;
using BokaMarket.Shared;
using Microsoft.AspNetCore.Authorization;

namespace BokaMarket.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly AppDbContext _db;

    public SettingsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<AppSettings>> GetSettings()
    {
        var settings = await _db.Settings.FirstOrDefaultAsync();
        if (settings == null)
        {
            settings = new AppSettings();
            _db.Settings.Add(settings);
            await _db.SaveChangesAsync();
        }
        return settings;
    }

    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateSettings(AppSettings settings)
    {
        var existing = await _db.Settings.FirstOrDefaultAsync();
        if (existing == null)
        {
            _db.Settings.Add(settings);
        }
        else
        {
            _db.Entry(existing).CurrentValues.SetValues(settings);
        }
        
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
