using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;

namespace OnlineBanking.Infrastructure.Data
{
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            // Update with your actual MySQL connection string
            optionsBuilder.UseMySql(
                "server=localhost;database=online_banking;user=root;password=cdac",
                new MySqlServerVersion(new Version(8, 0, 21))
            );
            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
} 