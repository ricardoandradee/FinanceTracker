import { Currency } from './currency.model';
import { TimeZone } from './timezone.model';

export interface User {
    id: number;
    userName: string;
    email: string;
    currency: Currency;
    stateTimeZone: TimeZone;
    createdDate: Date;
    wallet: number;
    lastActive: Date;
    stateTimeZoneId: string;
    password: string;
    country: string;
}