using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClaimsAPI.Models;
using ClaimsAPI.Data;
using ClaimsAPI.Services;

namespace ClaimsAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ITokenService _tokenService;

        public AuthController(AppDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email))
                return BadRequest(new { success = false, message = "Email is required" });

            try
            {
                // Find or create user
                var user = await _context.Users.FindAsync(request.Email);
                if (user == null)
                {
                    user = new UserModel
                    {
                        Email = request.Email,
                        FullName = request.Name ?? "Angular User",
                        CreatedDate = DateTime.UtcNow,
                        LastLogin = DateTime.UtcNow,
                        TotalClaimsSubmitted = 0
                    };
                    _context.Users.Add(user);
                }
                else
                {
                    user.LastLogin = DateTime.UtcNow;
                    user.FullName = request.Name ?? user.FullName;
                }

                await _context.SaveChangesAsync();

                // Generate token
                var token = _tokenService.GenerateJwtToken(user.Email, user.FullName);

                // Get user's claims count
                var claimsCount = await _context.Claims.CountAsync(c => c.Email == user.Email);

                // Return response in Angular-expected format
                return Ok(new
                {
                    success = true,
                    token = token,
                    email = user.Email,
                    name = user.FullName,
                    claimsSubmitted = claimsCount,
                    user = new
                    {
                        email = user.Email,
                        fullName = user.FullName,
                        totalClaimsSubmitted = user.TotalClaimsSubmitted
                    },
                    message = "Login successful"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Login error: {ex.Message}"
                });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email))
                return BadRequest(new { success = false, message = "Email is required" });

            try
            {
                var existingUser = await _context.Users.FindAsync(request.Email);
                if (existingUser != null)
                {
                    return BadRequest(new { success = false, message = "User already exists" });
                }

                var user = new UserModel
                {
                    Email = request.Email,
                    FullName = request.Name ?? "Angular User",
                    CreatedDate = DateTime.UtcNow,
                    LastLogin = DateTime.UtcNow,
                    TotalClaimsSubmitted = 0
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                var token = _tokenService.GenerateJwtToken(user.Email, user.FullName);

                return Ok(new
                {
                    success = true,
                    token = token,
                    email = user.Email,
                    name = user.FullName,
                    claimsSubmitted = 0,
                    user = new
                    {
                        email = user.Email,
                        fullName = user.FullName,
                        totalClaimsSubmitted = 0
                    },
                    message = "Registration successful"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Registration error: {ex.Message}"
                });
            }
        }
    }
}