﻿using System;

namespace FinanceTracker.Application.Dtos.Expenses
{
    public class ExpenseToReturnDto
    {
        public int Id { get; set; }
        public String CategoryName { get; set; }
        public int CategoryId { get; set; }
        public string Address { get; set; }
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
        public string Currency { get; set; }
        public decimal Price { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public string CreatedDateString { get; set; }
    }
}