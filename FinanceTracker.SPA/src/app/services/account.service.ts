import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { DatePipe } from '@angular/common';
import { Account } from '../models/account.model';

@Injectable()
export class AccountService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient,
        private datePipe: DatePipe) { }
        
    deleteAccount(bankId: number, accountId: number) {
        const user: User = JSON.parse(localStorage.getItem('user'));
        const url = `${this.baseUrl}user/${user.id}/bank/${bankId}/account/DeleteAccount/${accountId}`;
        return this.http.delete(url, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        });
    }

    createAccount(account: Account) {
        const user: User = JSON.parse(localStorage.getItem('user'));
        const createdDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
        const newAccount = {
            name: account.name,
            number: account.number,
            currency: account.currency,
            currentBalance: account.currentBalance,
            bankId: account.bankId,
            isActive: account.isActive,
            createdDate
        };

        const url = `${this.baseUrl}user/${user.id}/bank/${account.bankId}/account/CreateAccount`;
        const httpHeaders = new HttpHeaders({
            'Content-Type' : 'application/json'
        });

        return this.http.post(url, newAccount, { headers: httpHeaders, observe: 'response' });
    }

    updateAccount(account: Account) {
        const user: User = JSON.parse(localStorage.getItem('user'));
        const url = `${this.baseUrl}user/${user.id}/bank/${account.bankId}/account/UpdateAccount/${account.id}`;
        const accountToUpdate = {
            name: account.name,
            number: account.number,
            currencyId: account.currency.id,
            isActive: account.isActive
        };
        const httpHeaders = new HttpHeaders({
            'Content-Type' : 'application/json'
        });

        return this.http.put(url, accountToUpdate, { headers: httpHeaders, observe: 'response' });
    }
}