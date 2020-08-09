﻿using AutoMapper;
using FinanceTracker.Application.Common.Interfaces;
using FinanceTracker.Application.Dtos.Users;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace FinanceTracker.Application.Commands.Users
{
    public class UpdateUserBaseCurrencyCommand : IRequest<UserForDetailedDto>
    {
        public int UserId { get; }
        public int CurrencyId { get; }
        public UpdateUserBaseCurrencyCommand(int userId, int currencyId)
        {
            UserId = userId;
            CurrencyId = currencyId;
        }

        public class UpdateUserBaseCurrencyHandler : IRequestHandler<UpdateUserBaseCurrencyCommand, UserForDetailedDto>
        {
            private readonly IUserRepository _userUepository;
            private readonly IUnitOfWorkRepository _unitOfWorkRepository;
            private readonly IMapper _mapper;

            public UpdateUserBaseCurrencyHandler(IUserRepository userUepository,
                IUnitOfWorkRepository unitOfWorkRepository, IMapper mapper)
            {
                _mapper = mapper;
                _userUepository = userUepository;
                _unitOfWorkRepository = unitOfWorkRepository;
            }

            public async Task<UserForDetailedDto> Handle(UpdateUserBaseCurrencyCommand request, CancellationToken cancellationToken)
            {
                var userFromRepo = await _userUepository.RetrieveById(request.UserId);

                if (userFromRepo.CurrencyId != request.CurrencyId)
                {
                    userFromRepo.CurrencyId = request.CurrencyId;
                    if (await _unitOfWorkRepository.SaveChanges() > 0)
                    {
                        return _mapper.Map<UserForDetailedDto>(userFromRepo);
                    }
                }
                return null;
            }
        }
    }
}
