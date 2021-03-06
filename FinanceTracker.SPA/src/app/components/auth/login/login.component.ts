import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  private allSubscriptions: Subscription[] = [];

  constructor(private authService: AuthService, private commonService: CommonService, private router: Router) { }

  ngOnInit() {
    this.loginForm = this.createFormGroup();
  }

  createFormGroup() {
    return new FormGroup({
      userName: new FormControl('', [Validators.required, Validators.minLength(6)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  createFormGroupWithBuilder(formBuilder: FormBuilder) {
    return formBuilder.group({
      userName: 'loren',
      password: 'password'
    });
  }

  onLogin() {
    const result: any = Object.assign({}, this.loginForm.value);
    const loginSubscription = this.authService.login({ Username: result.userName, Password: result.password});
    loginSubscription.add(() => {
      const user: User = JSON.parse(localStorage.getItem('user'));
      const loginHistorySubscription = this.commonService.createUserLoginHistory(
        {
          UserName: result.userName,
          UserId: user != null ? user.id : null,
          IsSuccessful: user != null ? true : false
        }).subscribe((response) => { console.log('User login history successfully created.'); });
      this.allSubscriptions.push(loginHistorySubscription);
    });
    this.allSubscriptions.push(loginSubscription);
  }

  ngOnDestroy(): void {
    this.allSubscriptions.forEach(s => { s.unsubscribe()});
  }
}
