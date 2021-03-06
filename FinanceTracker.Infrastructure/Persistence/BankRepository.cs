﻿using FinanceTracker.Application.Common.Exceptions;
using FinanceTracker.Application.Common.Interfaces;
using FinanceTracker.Domain.Entities;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace FinanceTracker.Infrastructure.Persistence
{
    public class BankRepository : Repository<Bank>, IBankRepository
    {
        public BankRepository(IUnitOfWorkRepository unitOfWork)
            : base(unitOfWork)
        {
        }

        public async Task<IEnumerable<Bank>> GetBanksByUserId(int userId)
        {
            var banks = await _unitOfWork.Context.Banks.Where(b => b.User.Id == userId)
                .Include(bank => bank.Accounts).ThenInclude(account => account.Transactions)
                .Include(bank => bank.Accounts).ThenInclude(account => account.Currency)
            .ToListAsync();
            
            return banks;
        }

        public async Task<bool> BelongsToUser(int userId, int bankId)
        {
            return await _unitOfWork.Context.Banks.AnyAsync(c => c.Id == bankId && c.User.Id == userId);
        }

        public async Task<IEnumerable<Account>> GetAllAccounts(int bankId)
        {
            return await _unitOfWork.Context.Accounts.Where(a => a.Bank.Id == bankId).ToListAsync();
        }
        
        public async Task<Bank> CreateBankWithAccount(Bank bank)
        {
            if (bank.Accounts.Count != 1)
            {
                throw new InvalidOperationException("It is neccessary to have exactly one account to create a BankAccount.");
            }
            var account = bank.Accounts.First();

            var userIdParam = new SqlParameter("userId", bank.UserId);
            var bankNameParam = new SqlParameter("bankName", bank.Name);
            var branchParam = new SqlParameter("branch", bank.Branch);
            var accountNameParam = new SqlParameter("accountName", account.Name);
            var accountNumberParam = new SqlParameter("accountNumber", account.Number);
            var accountCurrencyParam = new SqlParameter("accountCurrency", account.Currency.Id);
            var currentBalanceParam = new SqlParameter("currentBalance", account.CurrentBalance);
            var createdDateParam = new SqlParameter("createdDate", bank.CreatedDate);
            var bankIdParam = new SqlParameter("bankId", DbType.Int32) { Direction = ParameterDirection.Output };

            await _unitOfWork.Context.Database
                       .ExecuteSqlRawAsync(@"Exec CreateBankWithAccount @userId, @bankName, @branch, @accountName, @accountNumber, @accountCurrency, " +
                       "@currentBalance, @createdDate, @bankId Out"
                  , new[] { userIdParam, bankNameParam, branchParam, accountNameParam, accountNumberParam, accountCurrencyParam,
                    currentBalanceParam, createdDateParam, bankIdParam });

            var bankId = Convert.ToInt32(bankIdParam.Value);
            if (bankId == 0)
            {
                throw new NotFoundException($"Error while executing CreateBankWithAccount procedure for " +
                    $"User Id: {bank.UserId}.");
            }

            return await _unitOfWork.Context.Banks
                .Include(b => b.Accounts).ThenInclude(a => a.Transactions)
                .Include(b => b.Accounts).ThenInclude(a => a.Currency)
            .FirstAsync(a => a.Id == bankId);
        }
    }
}
