using OnlineBanking.Core.DTOs;

namespace OnlineBanking.Application.Services;

public interface IBankingService
{
    Task<AccountSummaryDto> GetAccountSummaryAsync(int accountId);
    Task<AccountDto> DepositAsync(DepositRequest request);
    Task<AccountDto> WithdrawAsync(WithdrawRequest request);
    Task<TransactionDto> TransferAsync(TransferRequest request);
    Task<IEnumerable<TransactionDto>> GetTransactionHistoryAsync(int accountId);
    Task<IEnumerable<TransactionDto>> GetUserTransactionsAsync(int userId);
    Task<IEnumerable<AccountDto>> GetUserAccountsAsync(int userId);
} 