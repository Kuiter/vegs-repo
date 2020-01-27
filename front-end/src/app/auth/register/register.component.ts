import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegisterData, RegisterResp } from '../_models/user.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      pwd1: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  register() {
    const user: RegisterData = {
      username: this.registerForm.controls.username.value,
      email: this.registerForm.controls.email.value,
      password: this.registerForm.controls.password.value
    };
    this.authService.registerUser(user).subscribe(
      (resp: RegisterResp) => {
        if (resp.created) {
          console.log('User created confirm now: ' + resp.token);
        }
      },
      error => {
        this.registerForm.controls.password.setErrors(
          {
            minLength: error.error.pwdError.minLength,
            maxLength: error.error.pwdError.maxLength,
            content: error.error.pwdError.content
          }
        );
        this.registerForm.controls.username.setErrors({
          exists: error.error.usName.exists
        });
        // console.error(error.error);
      }
    );
  }

}

function passwordMatchValidator(g: FormGroup) {
  if (g.get('password').value === g.get('pwd1').value) {
    return null;
  } else {
    // mat error only displays error message if error is associated to the formControl!
    g.controls.pwd1.setErrors({ incorrect: true });
    return { mismatch: true };
  }

}
