import { Component, OnInit,  EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CurrencyList } from 'src/app/models/currency.model';
import { CurrencyService } from 'src/app/services/currency.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();
  currencies = [];
  userBaseCurrency = '';
  disableBaseCurrency = true;
  isAuth$: Observable<boolean>;

  constructor(private authService: AuthService,
              private router: Router,
              private currencyService: CurrencyService) {
    this.currencies = CurrencyList;
   }

  ngOnInit() {
    this.isAuth$ = this.authService.getIsAuthenticated;
    this.currencyService.getUserBaseCurrency.subscribe(currency => {
      this.userBaseCurrency = currency ? currency : 'EUR';
    });
  }

  isActive(url: string): boolean {
    return this.router.isActive(url, false);
  }

  saveUserBaseCurrency() {
    this.currencyService.updateUserBaseCurrency(this.userBaseCurrency).subscribe(response => {
      const user = this.getUserBaseCurrencyFromLocalStorage();
      this.currencyService.setUserBaseCurrency = this.userBaseCurrency;
      user.userCurrency = this.userBaseCurrency;
      localStorage.setItem('user', JSON.stringify(user));
    }).add(() => {
      this.disableBaseCurrency = true;
    });
  }

  private getUserBaseCurrencyFromLocalStorage(): User {
      const user: User = JSON.parse(localStorage.getItem('user'));
      return user;
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }
}