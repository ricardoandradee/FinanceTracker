﻿using AutoMapper;
using FinanceTracker.Application.Common.Interfaces;
using FinanceTracker.Application.Dtos.Expenses;
using FinanceTracker.Application.Dtos.Accounts;
using FinanceTracker.Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace FinanceTracker.Application.Commands.Expenses
{
    public class CreateExpenseCommand : IRequest<ExpenseToReturnDto>
    {
        public ExpenseForCreationDto ExpenseForCreationDto { get; }
        public CreateExpenseCommand(ExpenseForCreationDto expenseForCreationDto)
        {
            ExpenseForCreationDto = expenseForCreationDto;
        }

        public class CreateExpenseHandler : IRequestHandler<CreateExpenseCommand, ExpenseToReturnDto>
        {
            private readonly IExpenseRepository _expenseRepository;
            private readonly ITransactionRepository _transactionRepository;
            private readonly IAccountRepository _accountRepository;
            private readonly IUnitOfWorkRepository _unitOfWorkRepository;
            private readonly IMapper _mapper;

            public CreateExpenseHandler(IExpenseRepository expenseRepository,
                IMapper mapper, IUnitOfWorkRepository unitOfWorkRepository,
                IAccountRepository accountRepository,
                ITransactionRepository transactionRepository)
            {
                _mapper = mapper;
                _unitOfWorkRepository = unitOfWorkRepository;
                _expenseRepository = expenseRepository;
                _transactionRepository = transactionRepository;
                _accountRepository = accountRepository;
            }

            public async Task<ExpenseToReturnDto> Handle(CreateExpenseCommand request, CancellationToken cancellationToken)
            {
                var transaction = _mapper.Map<Transaction>(request.ExpenseForCreationDto.Transaction);
                if (transaction != null) {
                    var accountFromRepo = await _accountRepository.RetrieveById(transaction.AccountId);
                    accountFromRepo.CurrentBalance -= transaction.Amount;
                    transaction.BalanceAfterTransaction = accountFromRepo.CurrentBalance;
                }

                var expense = _mapper.Map<Expense>(request.ExpenseForCreationDto);
                expense.Transaction = transaction;
                await _expenseRepository.Add(expense);

                if (await _unitOfWorkRepository.SaveChanges() > 0)
                {
                    expense.Category = await _unitOfWorkRepository.Context.Categories.FindAsync(expense.CategoryId);
                    expense.Currency = await _unitOfWorkRepository.Context.Currencies.FindAsync(expense.CurrencyId);
                    var expenseToReturn = _mapper.Map<ExpenseToReturnDto>(expense);
                    if (expense.Transaction != null)
                    {
                        expenseToReturn.Account = _mapper.Map<AccountToReturnDto>(expense.Transaction.Account);
                    }
                    return expenseToReturn;
                }

                return null;
            }
        }
    }
}
