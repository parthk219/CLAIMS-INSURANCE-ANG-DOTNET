using Microsoft.EntityFrameworkCore;
using ClaimsAPI.Model;

namespace ClaimsAPI.DbContext
{
    public class AppDbContext : Microsoft.EntityFrameworkCore.DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<ClaimModel> Claims { get; set; }
    }
}
