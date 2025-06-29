using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineBanking.Application.Services;
using OnlineBanking.Core.DTOs;
using System.Security.Claims;

namespace OnlineBanking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BankingController : ControllerBase
{
    private readonly IBankingService _bankingService;

    public BankingController(IBankingService bankingService)
    {
        _bankingService = bankingService;
    }

    [HttpGet("accounts")]
    public async Task<ActionResult<IEnumerable<AccountDto>>> GetUserAccounts()
    {
        try
        {
            var userId = GetUserIdFromToken();
            var accounts = await _bankingService.GetUserAccountsAsync(userId);
            return Ok(accounts);
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred while fetching accounts" });
        }
    }

    [HttpGet("accounts/{accountId}/summary")]
    public async Task<ActionResult<AccountSummaryDto>> GetAccountSummary(int accountId)
    {
        try
        {
            var summary = await _bankingService.GetAccountSummaryAsync(accountId);
            return Ok(summary);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred while fetching account summary" });
        }
    }

    [HttpPost("deposit")]
    public async Task<ActionResult<AccountDto>> Deposit([FromBody] DepositRequest request)
    {
        try
        {
            var account = await _bankingService.DepositAsync(request);
            return Ok(account);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred during deposit" });
        }
    }

    [HttpPost("withdraw")]
    public async Task<ActionResult<AccountDto>> Withdraw([FromBody] WithdrawRequest request)
    {
        try
        {
            var account = await _bankingService.WithdrawAsync(request);
            return Ok(account);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred during withdrawal" });
        }
    }

    [HttpPost("transfer")]
    public async Task<ActionResult<TransactionDto>> Transfer([FromBody] TransferRequest request)
    {
        try
        {
            var transaction = await _bankingService.TransferAsync(request);
            return Ok(transaction);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred during transfer" });
        }
    }

    [HttpGet("accounts/{accountId}/transactions")]
    public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactionHistory(int accountId)
    {
        try
        {
            var transactions = await _bankingService.GetTransactionHistoryAsync(accountId);
            return Ok(transactions);
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred while fetching transaction history" });
        }
    }

    [HttpGet("transactions")]
    public async Task<ActionResult<IEnumerable<TransactionDto>>> GetUserTransactions()
    {
        try
        {
            var userId = GetUserIdFromToken();
            var transactions = await _bankingService.GetUserTransactionsAsync(userId);
            return Ok(transactions);
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred while fetching transactions" });
        }
    }

    private int GetUserIdFromToken()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdClaim, out int userId))
        {
            return userId;
        }
        throw new InvalidOperationException("Invalid user token");
    }
} 