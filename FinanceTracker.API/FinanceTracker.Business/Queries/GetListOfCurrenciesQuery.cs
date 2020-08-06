﻿using AutoMapper;
using FinanceTracker.Business.Dtos;
using FinanceTracker.Business.Repositories.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace FinanceTracker.Business.Queries
{
    public class GetListOfCurrenciesQuery : IRequest<string>
    {
        public GetListOfCurrenciesQuery()
        {
        }

        public class GetListOfCurrenciesHandler : IRequestHandler<GetListOfCurrenciesQuery, string>
        {
            public async Task<string> Handle(GetListOfCurrenciesQuery request, CancellationToken cancellationToken)
            {
                using (HttpClient client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Accept.Clear();
                    HttpResponseMessage response = await client.GetAsync(
                        $"http://data.fixer.io/api/{DateTime.UtcNow.ToString("yyyy-MM-dd")}?access_key=64331659be802cac357a58afd15be63e&format=1");
                    return response.IsSuccessStatusCode ? response.Content.ReadAsStringAsync().Result : string.Empty;
                }
            }
        }
    }
}
