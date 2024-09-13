import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(
    public userService: UserService,
    private dialog: MatDialog,
    private router: Router) {}

  login() {
    this.dialog
              .open(LoginComponent, {
                width: '30%',
              })
              .afterClosed()
              .subscribe((result: boolean) => {
                if(!result) return;

                this.router.navigate(['/products']);
              });
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }

  register() {
    this.dialog
              .open(RegisterComponent, {
                width: '30%',
              })
              .afterClosed()
              .subscribe((result: boolean) => {
                if(!result) return;

                this.router.navigate(['/']);
              });
  }
}
