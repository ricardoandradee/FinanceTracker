﻿using System;

namespace FinanceTracker.Application.Dtos.Expenses
{
    public class ExpenseForCreationDto
    {
        public ExpenseForCreationDto()
        {
            CreatedDate = DateTimeOffset.UtcNow;
        }

        public int CategoryId { get; set; }
        public int? AccountId { get; set; }
        public string Establishment { get; set; }
        public decimal AmountPaid { get; set; }
        public int CurrencyId { get; set; }
        public decimal Price { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
    }
}
