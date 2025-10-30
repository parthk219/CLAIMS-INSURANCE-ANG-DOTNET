using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ClaimsAPI.Model;
using ClaimsAPI.DbContext;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace ClaimsAPI.Controllers
{
    [ApiController]
    [Route("api/claims")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ClaimsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public ClaimsController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFiles(List<IFormFile> files)
        {
            try
            {
                var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
                Directory.CreateDirectory(uploadPath);

                foreach (var file in files)
                {
                    var filePath = Path.Combine(uploadPath, file.FileName);
                    using var stream = new FileStream(filePath, FileMode.Create);
                    await file.CopyToAsync(stream);
                }

                return Ok(new { message = "Files uploaded successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("submit")]
        public async Task<IActionResult> SubmitClaim([FromBody] ClaimModel claimModel)
        {
            if (claimModel == null)
                return BadRequest("Invalid claim data.");

            // Set system-generated fields
            claimModel.Id = Guid.NewGuid().ToString();
            claimModel.Status = "Submitted";

            try
            {
                _context.Claims.Add(claimModel);
                await _context.SaveChangesAsync();

                var token = GenerateJwtToken(claimModel.Id);

                return Ok(new
                {
                    Claim = claimModel,
                    Token = token,
                    Message = "Claim submitted successfully"
                });
            }
            catch (Exception ex)
            {
                return Problem(
                    detail: ex.Message,
                    statusCode: 500,
                    title: "An error occurred while submitting the claim."
                );
            }
        }

        [HttpGet("{claimId}/status")]
        public async Task<IActionResult> GetClaimStatus(string claimId)
        {
            try
            {
                var claim = await _context.Claims.FindAsync(claimId);
                if (claim == null)
                    return NotFound(new { message = "Claim not found" });

                return Ok(new
                {
                    Status = claim.Status,
                  //  LastUpdated = claim.ModifiedDate ?? claim.CreatedDate
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving claim status: {ex.Message}");
            }
        }

        private string GenerateJwtToken(string claimId)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, claimId),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, "User") // Default role
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}