import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { UserLogin } from '../models/user-login';
import { UserToken } from '../models/user-token';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<LoginComponent>,
    private userService: UserService,
    private toastr: ToastrService,
    private fb: FormBuilder) {
    this.loginForm = fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  login() {

    if(this.loginForm.invalid) return;

    const loginData = this.loginForm.value as UserLogin;

    this.userService.login(loginData).subscribe({
      next: (userToken: UserToken) => {
        this.toastr.success('Login Successfull', 'User Login');

        localStorage.setItem("userName", loginData.userName);
        localStorage.setItem("idToken", userToken.idToken);

        this.dialogRef.close(true);
      },
      error: (err: any) => {
        this.toastr.error('Login Failed', 'User Login');
      }
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }

  // Accessor
  get userName(): FormControl {
      return this.loginForm.get('userName') as FormControl;
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }
}
