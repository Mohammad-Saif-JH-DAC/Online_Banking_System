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

    [HttpPost("beneficiaries")]
    public async Task<IActionResult> AddBeneficiary([FromBody] AddBeneficiaryRequest request)
    {
        var userId = GetUserIdFromToken();
        await _bankingService.AddBeneficiaryAsync(new AddBeneficiaryRequest
        {
            UserId = userId,
            Name = request.Name,
            AccountNumber = request.AccountNumber
        });
        return Ok(new { message = "Beneficiary added successfully" });
    }

    [HttpGet("beneficiaries")]
    public async Task<ActionResult<IEnumerable<BeneficiaryDto>>> GetBeneficiaries()
    {
        var userId = GetUserIdFromToken();
        var beneficiaries = await _bankingService.GetBeneficiariesAsync(userId);
        Console.WriteLine($"GetBeneficiaries for userId: {userId}, found: {beneficiaries.Count()} beneficiaries");
        foreach (var b in beneficiaries)
        {
            Console.WriteLine($"Beneficiary: Id={b.Id}, Name={b.Name}, AccountNumber={b.AccountNumber}");
        }
        return Ok(beneficiaries);
    }

    [HttpDelete("beneficiaries/{id}")]
    public async Task<IActionResult> DeleteBeneficiary(int id)
    {
        var userId = GetUserIdFromToken();
        await _bankingService.DeleteBeneficiaryAsync(id, userId);
        return Ok(new { message = "Beneficiary deleted successfully" });
    }

    [HttpPost("fast-transfer")]
    public async Task<ActionResult<TransactionDto>> FastTransfer([FromBody] TransferRequest request)
    {
        var transaction = await _bankingService.TransferAsync(request);
        return Ok(transaction);
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