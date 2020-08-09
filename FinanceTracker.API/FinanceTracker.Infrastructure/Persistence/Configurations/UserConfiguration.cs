﻿using FinanceTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinanceTracker.Infrastructure.Persistence.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.Property(t => t.UserName)
                .HasMaxLength(30)
                .IsRequired();

            builder.Property(t => t.BaseCurrency)
                .HasMaxLength(3)
                .IsRequired();

            builder.Property(t => t.Country)
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(t => t.Email)
                .HasMaxLength(100)
                .IsRequired();
        }
    }
}
