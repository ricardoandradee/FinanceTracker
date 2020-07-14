export interface User {
    id: number;
    userName: string;
    userCurrency: string;
    age?: number;
    created: Date;
    wallet: number;
    lastActive: Date;
    city: string;
    password: string;
    country: string;
}