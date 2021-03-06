﻿using System;
using FinanceTracker.Application.Dtos.Categories;
using FinanceTracker.Application.Dtos.Currencies;

namespace FinanceTracker.Application.Dtos.Expenses
{
    public class ExpenseToReturnDto
    {
        public int Id { get; set; }
        public CategoryToReturnDto Category { get; set; }
        public string Establishment { get; set; }
        public string Description { get; set; }
        public string Status
        {
            get
            {
                return AmountPaid == 0 ? "Unpaid" :
                       (Price < AmountPaid ? "Partial" : "Paid");
            }
        }
        public decimal AmountPaid { get; set; }
        public CurrencyDto Currency { get; set; }
        public decimal Price { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public string CreatedDateString { get; set; }
    }
}
