using OnlineBanking.Application.Services;
using OnlineBanking.Core.DTOs;
using OnlineBanking.Core.Entities;
using OnlineBanking.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace OnlineBanking.Application.Services;

public class BankingService : IBankingService
{
    private readonly IAccountRepository _accountRepository;
    private readonly ITransactionRepository _transactionRepository;
    private readonly IBeneficiaryRepository _beneficiaryRepository;

    public BankingService(IAccountRepository accountRepository, ITransactionRepository transactionRepository, IBeneficiaryRepository beneficiaryRepository)
    {
        _accountRepository = accountRepository;
        _transactionRepository = transactionRepository;
        _beneficiaryRepository = beneficiaryRepository;
    }

    public async Task<AccountSummaryDto> GetAccountSummaryAsync(int accountId)
    {
        var account = await _accountRepository.GetAccountWithTransactionsAsync(accountId);
        if (account == null)
        {
            throw new InvalidOperationException("Account not found");
        }

        var recentTransactions = await _transactionRepository.GetRecentTransactionsAsync(accountId, 5);
        
        return new AccountSummaryDto
        {
            Id = account.Id,
            AccountNumber = account.AccountNumber,
            Balance = account.Balance,
            IsActive = account.IsActive,
            RecentTransactions = recentTransactions.Select(t => new TransactionDto
            {
                Id = t.Id,
                Amount = t.Amount,
                Type = t.Type,
                Status = t.Status,
                Description = t.Description,
                CreatedAt = t.CreatedAt,
                FromAccountNumber = t.FromAccount?.AccountNumber,
                ToAccountNumber = t.ToAccount?.AccountNumber
            }).ToList()
        };
    }

    public async Task<AccountDto> DepositAsync(DepositRequest request)
    {
        var account = await _accountRepository.GetByIdWithUserAsync(request.AccountId);
        if (account == null)
        {
            throw new InvalidOperationException("Account not found");
        }

        if (!account.IsActive)
        {
            throw new InvalidOperationException("Account is deactivated");
        }

        // Create deposit transaction
        var transaction = new Transaction
        {
            ToAccountId = account.Id,
            Amount = request.Amount,
            Type = "Deposit",
            Status = "Completed",
            Description = request.Description ?? "Deposit",
            CreatedAt = DateTime.UtcNow
        };

        await _transactionRepository.AddAsync(transaction);

        // Update account balance
        account.Balance += request.Amount;
        account.LastTransactionAt = DateTime.UtcNow;
        await _accountRepository.UpdateAsync(account);

        return new AccountDto
        {
            Id = account.Id,
            AccountNumber = account.AccountNumber,
            Balance = account.Balance,
            IsActive = account.IsActive,
            CreatedAt = account.CreatedAt,
            LastTransactionAt = account.LastTransactionAt,
            User = new UserDto
            {
                Id = account.User.Id,
                FullName = account.User.FullName,
                Email = account.User.Email,
                Role = account.User.Role,
                IsActive = account.User.IsActive,
                CreatedAt = account.User.CreatedAt
            }
        };
    }

    public async Task<AccountDto> WithdrawAsync(WithdrawRequest request)
    {
        var account = await _accountRepository.GetByIdWithUserAsync(request.AccountId);
        if (account == null)
        {
            throw new InvalidOperationException("Account not found");
        }

        if (!account.IsActive)
        {
            throw new InvalidOperationException("Account is deactivated");
        }

        if (account.Balance < request.Amount)
        {
            throw new InvalidOperationException("Insufficient funds");
        }

        // Create withdrawal transaction
        var transaction = new Transaction
        {
            FromAccountId = account.Id,
            Amount = request.Amount,
            Type = "Withdraw",
            Status = "Completed",
            Description = request.Description ?? "Withdrawal",
            CreatedAt = DateTime.UtcNow
        };

        await _transactionRepository.AddAsync(transaction);

        // Update account balance
        account.Balance -= request.Amount;
        account.LastTransactionAt = DateTime.UtcNow;
        await _accountRepository.UpdateAsync(account);

        return new AccountDto
        {
            Id = account.Id,
            AccountNumber = account.AccountNumber,
            Balance = account.Balance,
            IsActive = account.IsActive,
            CreatedAt = account.CreatedAt,
            LastTransactionAt = account.LastTransactionAt,
            User = new UserDto
            {
                Id = account.User.Id,
                FullName = account.User.FullName,
                Email = account.User.Email,
                Role = account.User.Role,
                IsActive = account.User.IsActive,
                CreatedAt = account.User.CreatedAt
            }
        };
    }

    public async Task<TransactionDto> TransferAsync(TransferRequest request)
    {
        var fromAccount = await _accountRepository.GetByIdAsync(request.FromAccountId);
        if (fromAccount == null)
        {
            throw new InvalidOperationException("Source account not found");
        }

        if (!fromAccount.IsActive)
        {
            throw new InvalidOperationException("Source account is deactivated");
        }

        if (fromAccount.Balance < request.Amount)
        {
            throw new InvalidOperationException("Insufficient funds");
        }

        var toAccount = await _accountRepository.GetByAccountNumberAsync(request.ToAccountNumber);
        if (toAccount == null)
        {
            throw new InvalidOperationException("Destination account not found");
        }

        if (!toAccount.IsActive)
        {
            throw new InvalidOperationException("Destination account is deactivated");
        }

        if (fromAccount.Id == toAccount.Id)
        {
            throw new InvalidOperationException("Cannot transfer to the same account");
        }

        // Create transfer transaction
        var transaction = new Transaction
        {
            FromAccountId = fromAccount.Id,
            ToAccountId = toAccount.Id,
            Amount = request.Amount,
            Type = "Transfer",
            Status = "Completed",
            Description = request.Description ?? "Transfer",
            CreatedAt = DateTime.UtcNow
        };

        await _transactionRepository.AddAsync(transaction);

        // Update account balances
        fromAccount.Balance -= request.Amount;
        fromAccount.LastTransactionAt = DateTime.UtcNow;
        await _accountRepository.UpdateAsync(fromAccount);

        toAccount.Balance += request.Amount;
        toAccount.LastTransactionAt = DateTime.UtcNow;
        await _accountRepository.UpdateAsync(toAccount);

        return new TransactionDto
        {
            Id = transaction.Id,
            Amount = transaction.Amount,
            Type = transaction.Type,
            Status = transaction.Status,
            Description = transaction.Description,
            CreatedAt = transaction.CreatedAt,
            FromAccountNumber = fromAccount.AccountNumber,
            ToAccountNumber = toAccount.AccountNumber
        };
    }

    public async Task<IEnumerable<TransactionDto>> GetTransactionHistoryAsync(int accountId)
    {
        var transactions = await _transactionRepository.GetTransactionsByAccountIdAsync(accountId);
        
        return transactions.Select(t => new TransactionDto
        {
            Id = t.Id,
            Amount = t.Amount,
            Type = t.Type,
            Status = t.Status,
            Description = t.Description,
            CreatedAt = t.CreatedAt,
            FromAccountNumber = t.FromAccount?.AccountNumber,
            ToAccountNumber = t.ToAccount?.AccountNumber
        });
    }

    public async Task<IEnumerable<AccountDto>> GetUserAccountsAsync(int userId)
    {
        var accounts = await _accountRepository.GetAccountsByUserIdAsync(userId);
        
        return accounts.Select(a => new AccountDto
        {
            Id = a.Id,
            AccountNumber = a.AccountNumber,
            Balance = a.Balance,
            IsActive = a.IsActive,
            CreatedAt = a.CreatedAt,
            LastTransactionAt = a.LastTransactionAt,
            User = new UserDto
            {
                Id = a.User.Id,
                FullName = a.User.FullName,
                Email = a.User.Email,
                Role = a.User.Role,
                IsActive = a.User.IsActive,
                CreatedAt = a.User.CreatedAt
            }
        });
    }

    public async Task<IEnumerable<TransactionDto>> GetUserTransactionsAsync(int userId)
    {
        var transactions = await _transactionRepository.GetTransactionsByUserIdAsync(userId);
        
        return transactions.Select(t => new TransactionDto
        {
            Id = t.Id,
            Amount = t.Amount,
            Type = t.Type,
            Status = t.Status,
            Description = t.Description,
            CreatedAt = t.CreatedAt,
            FromAccountNumber = t.FromAccount?.AccountNumber,
            ToAccountNumber = t.ToAccount?.AccountNumber
        });
    }

    public async Task AddBeneficiaryAsync(AddBeneficiaryRequest request)
    {
        // Verify account exists and name matches
        var account = await _accountRepository.GetByAccountNumberAsync(request.AccountNumber);
        if (account == null)
            throw new InvalidOperationException("Account number does not exist.");
        var dbName = account.User.FullName.Trim();
        var enteredName = request.Name.Trim();
        Console.WriteLine($"DB Name: '{dbName}' | Entered Name: '{enteredName}'");
        if (!string.Equals(dbName, enteredName, StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("Beneficiary name does not match account holder's name.");
        // Prevent duplicate beneficiary
        var existing = (await _beneficiaryRepository.GetByUserIdAsync(request.UserId))
            .FirstOrDefault(b => b.AccountNumber == request.AccountNumber);
        if (existing != null)
            throw new InvalidOperationException("This beneficiary is already added.");
        var beneficiary = new Beneficiary
        {
            UserId = request.UserId,
            Name = enteredName,
            AccountNumber = request.AccountNumber,
            CreatedAt = DateTime.UtcNow
        };
        try
        {
            await _beneficiaryRepository.AddAsync(beneficiary);
        }
        catch (DbUpdateException ex) when (ex.InnerException != null && ex.InnerException.Message.Contains("unique_user_account"))
        {
            throw new InvalidOperationException("This beneficiary is already added.");
        }
    }

    public async Task<IEnumerable<BeneficiaryDto>> GetBeneficiariesAsync(int userId)
    {
        var beneficiaries = await _beneficiaryRepository.GetByUserIdAsync(userId);
        return beneficiaries.Select(b => new BeneficiaryDto
        {
            Id = b.Id,
            Name = b.Name,
            AccountNumber = b.AccountNumber,
            CreatedAt = b.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss")
        });
    }

    public async Task DeleteBeneficiaryAsync(int beneficiaryId, int userId)
    {
        await _beneficiaryRepository.DeleteByUserAsync(beneficiaryId, userId);
    }
} 