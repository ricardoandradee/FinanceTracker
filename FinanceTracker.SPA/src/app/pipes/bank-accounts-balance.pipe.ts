import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyConverterMapper } from '../models/currency.converter.mapper.model';
import { CurrencyService } from '../services/currency.service';
import { Account } from '../models/account.model';

@Pipe({
  name: 'bankAccountsBalance'
})
export class BankAccountsBalance implements PipeTransform {
    constructor(public currencyService: CurrencyService) { }

    transform(items: Account[], userBaseCurrency: string): number {
        const allCurrenciesToConvert = items.map(x => x.currency);
        if (this.currencyService.checkIfCurrenciesAreLoaded(allCurrenciesToConvert)) {
        const currencyMapperList = items.filter((x) => (x.isActive)).map((payment: Account) => {
            return { currencyFrom: payment.currency, currencyTo: userBaseCurrency,
                     price: payment.currentBalance } as CurrencyConverterMapper;
        });
        return this.currencyService.convertCurrencyList(currencyMapperList);
        }
    }
}