﻿using System;
using System.Collections.Generic;

namespace FinanceTracker.Domain.Entities
{
    public class Bank
    {
        public int Id { get; set; }
        public virtual User User { get; set; }
        public string Name { get; set; }
        public string Branch { get; set; }
        public bool IsActive { get; set; }
        public virtual ICollection<Account> Accounts { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}