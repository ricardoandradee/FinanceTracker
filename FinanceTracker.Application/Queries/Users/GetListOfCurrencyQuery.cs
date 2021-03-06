﻿using AutoMapper;
using FinanceTracker.Application.Common.Interfaces;
using FinanceTracker.Application.Dtos.Currencies;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace FinanceTracker.Application.Queries.Users
{
    public class GetListOfCurrencyQuery : IRequest<List<CurrencyDto>>
    {
        public GetListOfCurrencyQuery()
        {
        }

        public class GetListOfCurrenciesHandler : IRequestHandler<GetListOfCurrencyQuery, List<CurrencyDto>>
        {
            private readonly IUnitOfWorkRepository _unitOfWorkRepository;
            private readonly IMapper _mapper;

            public GetListOfCurrenciesHandler(IUnitOfWorkRepository unitOfWorkRepository, IMapper mapper)
            {
                _mapper = mapper;
                _unitOfWorkRepository = unitOfWorkRepository;
            }

            public async Task<List<CurrencyDto>> Handle(GetListOfCurrencyQuery request, CancellationToken cancellationToken)
            {
                var currencies = await _unitOfWorkRepository.Context.Currencies.ToListAsync();
                return _mapper.Map<List<CurrencyDto>>(currencies);
            }
        }
    }
}
