import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { UserRegistration } from '../models/user-registration';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registrationForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<RegisterComponent>,
    private userService: UserService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.registrationForm = fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  register() {
    if (this.registrationForm.invalid) return;

    const registrationData = this.registrationForm.value as UserRegistration;

    this.userService.register(registrationData).subscribe({
      next: (value: any) => {
        this.toastr.success(
          'User registered successfully',
          'User Registration'
        );
        this.dialogRef.close(true);
      },
      error: (err: any) => {
        this.toastr.error(
          'Registration Failed',
          'User Registration');
      },
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }

  // Accessor
  get fullName(): FormControl {
    return this.registrationForm.get('fullName') as FormControl;
  }

  get email(): FormControl {
    return this.registrationForm.get('email') as FormControl;
  }

  get userName(): FormControl {
    return this.registrationForm.get('userName') as FormControl;
  }

  get password(): FormControl {
    return this.registrationForm.get('password') as FormControl;
  }
}
