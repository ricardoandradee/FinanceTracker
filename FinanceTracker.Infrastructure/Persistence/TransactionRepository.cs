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
    public class TransactionRepository : Repository<Transaction>, ITransactionRepository
    {
        public TransactionRepository(IUnitOfWorkRepository unitOfWork)
            : base(unitOfWork)
        {
        }

        public async Task<IEnumerable<Transaction>> GetTransactionsByAccountId(int accountId)
        {
            var transactions = await _unitOfWork.Context.Transactions.Where(t => t.Account.Id == accountId).ToListAsync();
            return transactions;
        }

        public async Task<Transaction> PerformAccountTransaction(Transaction transaction)
        {
            var actionParam = new SqlParameter("action", transaction.Action);
            var amountParam = new SqlParameter("amount", transaction.Amount);
            var descriptionParam = new SqlParameter("description", transaction.Description);
            var createdDateParam = new SqlParameter("createdDate", transaction.CreatedDate);
            var accountIdParam = new SqlParameter("accountId", transaction.AccountId);
            var transactionIdParam = new SqlParameter("transactionId", DbType.Int32) { Direction = ParameterDirection.Output };

            await _unitOfWork.Context.Database
                       .ExecuteSqlRawAsync(@"Exec PerformAccountTransaction @action, @amount, @description, @createdDate, @accountId, @transactionId Out"
                  , new[] { actionParam, amountParam, descriptionParam, createdDateParam, accountIdParam, transactionIdParam });

            var transactionId = Convert.ToInt32(transactionIdParam.Value);
            if (transactionId == 0)
            {
                throw new NotFoundException($"Error while executing PerformAccountTransaction procedure for " +
                    $"Account Id: {transaction.AccountId}, Action: {transaction.Action}, Amount {transaction.Amount}.");
            }

            return await _unitOfWork.Context.Transactions.Include(a => a.Account)
                           .FirstAsync(t => t.Id == transactionId);
        }
    }
}
