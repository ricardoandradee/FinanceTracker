﻿using MediatR;
using System.Threading;
using System.Threading.Tasks;
using FinanceTracker.Application.Common.Interfaces;
using FinanceTracker.Application.Common.Exceptions;
using FinanceTracker.Domain.Entities;

namespace FinanceTracker.Application.Commands.Accounts
{
    public class DeleteAccountCommand : IRequest<bool>
    {
        public int AccountId { get; }
        public DeleteAccountCommand(int accountId)
        {
            AccountId = accountId;
        }

        public class DeleteAccountHandler : IRequestHandler<DeleteAccountCommand, bool>
        {
            private readonly IAccountRepository _accountRepository;
            private readonly IUnitOfWorkRepository _unitOfWorkRepository;

            public DeleteAccountHandler(IAccountRepository accountRepository, IUnitOfWorkRepository unitOfWorkRepository)
            {
                _unitOfWorkRepository = unitOfWorkRepository;
                _accountRepository = accountRepository;
            }

            public async Task<bool> Handle(DeleteAccountCommand request, CancellationToken cancellationToken)
            {
                var accountFromRepo = await _accountRepository.RetrieveById(request.AccountId);

                if (accountFromRepo == null)
                {
                    throw new NotFoundException(nameof(Account), request.AccountId);
                }

                // Soft delete
                accountFromRepo.IsDeleted = true;
                return await _unitOfWorkRepository.SaveChanges() > 0;
            }
        }
    }
}
