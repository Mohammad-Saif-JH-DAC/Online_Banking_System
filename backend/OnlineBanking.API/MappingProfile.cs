using AutoMapper;
using OnlineBanking.Core.DTOs;
using OnlineBanking.Core.Entities;

namespace OnlineBanking.API;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User mappings
        CreateMap<User, UserDto>();
        CreateMap<UserDto, User>();
        
        // Account mappings
        CreateMap<Account, AccountDto>();
        CreateMap<AccountDto, Account>();
        
        // Transaction mappings
        CreateMap<Transaction, TransactionDto>();
        CreateMap<TransactionDto, Transaction>();
    }
} 