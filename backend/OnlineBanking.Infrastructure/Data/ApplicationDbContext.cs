using Microsoft.EntityFrameworkCore;
using OnlineBanking.Core.Entities;

namespace OnlineBanking.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Account> Accounts { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<Beneficiary> Beneficiaries { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(150);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Role).IsRequired().HasMaxLength(20);
            // entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // Account configuration
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.AccountNumber).IsRequired().HasMaxLength(20);
            entity.HasIndex(e => e.AccountNumber).IsUnique();
            entity.Property(e => e.Balance).HasColumnType("decimal(18,2)").HasDefaultValue(0);
            // entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            entity.HasOne(e => e.User)
                .WithMany(e => e.Accounts)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Transaction configuration
        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Type).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
            // entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            entity.HasOne(e => e.FromAccount)
                .WithMany(e => e.FromTransactions)
                .HasForeignKey(e => e.FromAccountId)
                .OnDelete(DeleteBehavior.Restrict);
                
            entity.HasOne(e => e.ToAccount)
                .WithMany(e => e.ToTransactions)
                .HasForeignKey(e => e.ToAccountId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Seed data
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Seed admin user
        modelBuilder.Entity<User>().HasData(new User
        {
            Id = 1,
            FullName = "Admin User",
            Email = "admin@bank.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Role = "Admin",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        });

        // Seed admin account
        modelBuilder.Entity<Account>().HasData(new Account
        {
            Id = 1,
            UserId = 1,
            AccountNumber = "1000000001",
            Balance = 10000.00m,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        });
    }
} 