import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginData, LoginResp } from '../_models/user.model';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  showError = false;

  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    const loginD: LoginData = {
      username: this.loginForm.controls.username.value,
      password: this.loginForm.controls.password.value
    };
    this.authService.login(loginD).subscribe(
      (resp: LoginResp) => {
        this.authService.isLoggedIn = true;
        this.router.navigate(['/admin']);
      },
      error => {
        this.showError = true;
      }
    );
  }

  resendUsername() {
    console.error('not implemented');
  }

  resetPwd() {
    console.error('not implemented');
  }

}
