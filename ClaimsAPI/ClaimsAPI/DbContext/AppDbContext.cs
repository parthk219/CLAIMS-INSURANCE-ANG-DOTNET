using Microsoft.EntityFrameworkCore;
using ClaimsAPI.Models;

namespace ClaimsAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<ClaimModel> Claims { get; set; }
        public DbSet<UserModel> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Seed initial user for testing
            modelBuilder.Entity<UserModel>().HasData(
                new UserModel
                {
                    Email = "tesl@example.com",
                    FullName = "Angular User",
                    PhoneNumber = "1234567890",
                    CreatedDate = DateTime.UtcNow.AddDays(-30),
                    LastLogin = DateTime.UtcNow,
                    TotalClaimsSubmitted = 1
                }
            );

            // Seed initial claim for testing
            modelBuilder.Entity<ClaimModel>().HasData(
                new ClaimModel
                {
                    Id = "seed-claim-1",
                    Email = "tesl@example.com",
                    Name = "Angular User",
                    PolicyNumber = "8688888888",
                    DateOfIncident = new DateTime(2025, 10, 9),
                    IncidentDetails = "ascas",
                    UploadedFileName = "tempimg13.jpg",
                    SubmittedDate = DateTime.UtcNow.AddDays(-1),
                    Status = "Submitted",
                    LastUpdated = DateTime.UtcNow.AddDays(-1),
                    ClaimsCount = 1
                }
            );
        }
    }
}