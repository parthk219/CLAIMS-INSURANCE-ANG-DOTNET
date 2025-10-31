using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Claims;
using ClaimsAPI.Models;
using ClaimsAPI.Data;

namespace ClaimsAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [AllowAnonymous]
    public class ClaimsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClaimsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetClaimsSummary()
        {
            try
            {
                var email = GetUserEmail();
                if (string.IsNullOrEmpty(email))
                    return Unauthorized(new { success = false, message = "Invalid token" });

                var claimsCount = await _context.Claims.CountAsync(c => c.Email == email);
                var recentClaims = await _context.Claims
                    .Where(c => c.Email == email)
                    .OrderByDescending(c => c.SubmittedDate)
                    .Take(5)
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    email = email,
                    claimsSubmitted = claimsCount,
                    recentClaims = recentClaims
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Error: {ex.Message}"
                });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetUserClaims()
        {
            try
            {
                var email = GetUserEmail();
                if (string.IsNullOrEmpty(email))
                    return Unauthorized(new { success = false, message = "Invalid token" });

                var claims = await _context.Claims
                    .Where(c => c.Email == email)
                    .OrderByDescending(c => c.SubmittedDate)
                    .ToListAsync();

                var claimsCount = await _context.Claims.CountAsync(c => c.Email == email);

                return Ok(new
                {
                    success = true,
                    claims = claims,
                    totalCount = claimsCount
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Error: {ex.Message}"
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetClaimById(string id)
        {
            try
            {
                var email = GetUserEmail();
                if (string.IsNullOrEmpty(email))
                    return Unauthorized(new { success = false, message = "Invalid token" });

                var claim = await _context.Claims
                    .FirstOrDefaultAsync(c => c.Id == id && c.Email == email);

                if (claim == null)
                    return NotFound(new { success = false, message = "Claim not found" });

                return Ok(new
                {
                    success = true,
                    claim = claim
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Error: {ex.Message}"
                });
            }
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFiles(List<IFormFile> files)
        {
            try
            {
                var email = GetUserEmail();
                if (string.IsNullOrEmpty(email))
                    return Unauthorized(new { success = false, message = "Invalid token" });

                var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", email);
                Directory.CreateDirectory(uploadPath);

                var fileNames = new List<string>();

                foreach (var file in files)
                {
                    var fileName = $"{Guid.NewGuid()}_{file.FileName}";
                    var filePath = Path.Combine(uploadPath, fileName);

                    using var stream = new FileStream(filePath, FileMode.Create);
                    await file.CopyToAsync(stream);

                    fileNames.Add(fileName);
                }

                return Ok(new
                {
                    success = true,
                    message = "Files uploaded successfully",
                    fileNames = fileNames,
                    count = fileNames.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Upload error: {ex.Message}"
                });
            }
        }

        [HttpPost("submit")]
        public async Task<IActionResult> SubmitClaim([FromBody] SubmitClaimRequest request)
        {
            if (request == null)
                return BadRequest(new { success = false, message = "Invalid claim data" });

            try
            {
                var email = GetUserEmail();
                if (string.IsNullOrEmpty(email))
                    return Unauthorized(new { success = false, message = "Invalid token" });

                // Get user's current claims count
                var userClaimsCount = await _context.Claims.CountAsync(c => c.Email == email);

                var claimModel = new ClaimModel
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = email,
                    Name = request.Name,
                    PolicyNumber = request.PolicyNumber,
                    DateOfIncident = request.DateOfIncident,
                    IncidentDetails = request.IncidentDetails,
                    UploadedFileName = request.UploadedFileName,
                    SubmittedDate = DateTime.UtcNow,
                    Status = "Submitted",
                    LastUpdated = DateTime.UtcNow,
                    ClaimsCount = userClaimsCount + 1
                };

                // Update user's total claims count
                var user = await _context.Users.FindAsync(email);
                if (user != null)
                {
                    user.TotalClaimsSubmitted++;
                    user.LastLogin = DateTime.UtcNow;
                }

                _context.Claims.Add(claimModel);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    claim = claimModel,
                    message = "Claim submitted successfully",
                    totalClaimsSubmitted = claimModel.ClaimsCount
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Submission error: {ex.Message}"
                });
            }
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateClaimStatus(string id, [FromBody] string status)
        {
            try
            {
                var email = GetUserEmail();
                if (string.IsNullOrEmpty(email))
                    return Unauthorized(new { success = false, message = "Invalid token" });

                var claim = await _context.Claims
                    .FirstOrDefaultAsync(c => c.Id == id && c.Email == email);

                if (claim == null)
                    return NotFound(new { success = false, message = "Claim not found" });

                claim.Status = status;
                claim.LastUpdated = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Claim status updated successfully",
                    claimId = claim.Id,
                    newStatus = claim.Status
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Error: {ex.Message}"
                });
            }
        }

        private string? GetUserEmail()
        {
            return User.FindFirst(ClaimTypes.Email)?.Value ??
                   User.FindFirst("email")?.Value ??
                   User.Identity?.Name;
        }
    }
}