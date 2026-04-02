using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BokaMarket.Shared;
using BokaMarket.Server.Data;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace BokaMarket.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
        {
            return Ok(new AuthResponse { Success = false, Message = "Invalid email or password." });
        }

        var token = GenerateJwtToken(user);

        return Ok(new AuthResponse
        {
            Success = true,
            Token = token,
            User = user
        });
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(User user)
    {
        if (await _context.Users.AnyAsync(u => u.Email == user.Email))
        {
            return Ok(new AuthResponse { Success = false, Message = "User already exists." });
        }

        user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(user);

        return Ok(new AuthResponse
        {
            Success = true,
            Token = token,
            User = user
        });
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile(User user)
    {
        var existing = await _context.Users.FindAsync(user.Id);
        if (existing == null) return NotFound();

        existing.FirstName = user.FirstName;
        existing.LastName = user.LastName;
        existing.Phone = user.Phone;
        existing.Address = user.Address;

        await _context.SaveChangesAsync();
        return Ok();
    }

    private string GenerateJwtToken(User user)
    {
        var jwtKey = _config["Jwt:Key"] ?? "BokaMarket_Super_Secret_Key_2026_!@#";
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
            new Claim(ClaimTypes.Role, user.Email.Contains("admin") ? "Admin" : "Customer")
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"] ?? "BokaMarket",
            audience: _config["Jwt:Audience"] ?? "BokaMarketUsers",
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
