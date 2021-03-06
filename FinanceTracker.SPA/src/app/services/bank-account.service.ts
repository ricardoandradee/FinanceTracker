import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BankAccount } from '../models/bank-account.model';
import { User } from '../models/user.model';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class BankAccountService {
    private baseUrl = environment.apiUrl;
    private dataSource$: BehaviorSubject<BankAccount[]> = new BehaviorSubject([]);

    constructor(private http: HttpClient) { }

        get getBankAccountInfos(): Observable<BankAccount[]> {
            return this.dataSource$.asObservable();
        }
    
        set setBankAccountInfos(bankInfos: BankAccount[]) {
            this.dataSource$.next(bankInfos);
        }
    
    getBanksByUserId(): Observable<BankAccount[]> {
        const user: User = JSON.parse(localStorage.getItem('user'));
        const url = `${this.baseUrl}user/${user.id}/bank/GetBanksByUserId`;

        return this.http.get<BankAccount[]>(url, { observe: 'response' })
        .pipe(
        map(response => {
            const bankAccount: BankAccount[] = response.body;
            return bankAccount;
        }));
    }
        
    deleteBankInfo(bankId: number) {
        const user: User = JSON.parse(localStorage.getItem('user'));
        const url = `${this.baseUrl}user/${user.id}/bank/DeleteBankInfo/${bankId}`;
        return this.http.delete(url, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        });
    }
    
    createBankWithAccount(bankAccount: BankAccount) {
        const user: User = JSON.parse(localStorage.getItem('user'));
        const newBankInfo = {
            userId: user.id,
            name: bankAccount.name,
            branch: bankAccount.branch,
            isActive: bankAccount.isActive,
            accounts: bankAccount.accounts
        };

        const url = `${this.baseUrl}user/${user.id}/bank/CreateBankWithAccount`;
        const httpHeaders = new HttpHeaders({
            'Content-Type' : 'application/json'
        });

        return this.http.post(url, newBankInfo, { headers: httpHeaders, observe: 'response' });
    }

    updateBankInfo(bankAccount: BankAccount) {
        const user: User = JSON.parse(localStorage.getItem('user')); 
        const url = `${this.baseUrl}user/${user.id}/bank/updateBankInfo/${bankAccount.id}`;
        const newBankInfo = {
            name: bankAccount.name,
            branch: bankAccount.branch,
            isActive: bankAccount.isActive,
            accountsForCreation: bankAccount.accounts
        };
        
        const httpHeaders = new HttpHeaders({
            'Content-Type' : 'application/json'
        });

        return this.http.put(url, newBankInfo, { headers: httpHeaders, observe: 'response' });
    }
}