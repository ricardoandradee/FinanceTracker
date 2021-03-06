using FinanceTracker.Application.Dtos.Accounts;
using System;

namespace FinanceTracker.Application.Dtos.Transactions
{
    public class TransactionToReturnDto
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public string Action { get; set; }
        public decimal BalanceAfterTransaction { get; set; }
        public AccountToReturnIntoTransactionDto Account { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
    }
}