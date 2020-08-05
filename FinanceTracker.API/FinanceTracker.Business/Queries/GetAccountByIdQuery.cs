﻿using FinanceTracker.Business.Dtos;
using MediatR;

namespace FinanceTracker.Business.Queries
{
    public class GetAccountByIdQuery : IRequest<AccountToReturnDto>
    {
        public int AccountId { get; }
        public GetAccountByIdQuery(int accountId)
        {
            AccountId = accountId;
        }
    }
}
