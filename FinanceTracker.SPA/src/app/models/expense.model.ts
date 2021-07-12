import { Currency } from './currency.model';
import { Category } from './category.model';
import { Transaction } from './transaction.model';
import { Account } from './account.model';

export interface Expense {
    id: number;
    establishment: string;
    category?: Category;
    currency: Currency;
    price: number;
    isPaid: boolean;
    account?: Account;
    createdDateString?: string;
    createdDate?: Date;
    transaction?: Transaction;
}