﻿using System;
using System.Collections.Generic;

namespace FinanceTracker.Domain.Entities
{
    public class StateTimeZone
    {
        public int Id { get; set; }
        public string Country { get; set; }
        public string UTC { get; set; }
        public string Description { get; set; }
    }
}