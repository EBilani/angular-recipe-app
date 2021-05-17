import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth-snackbar',
  templateUrl: './auth-snackbar.component.html',
  styleUrls: ['./auth-snackbar.component.css'],
})
export class AuthSnackbarComponent implements OnInit {
  isAuthenticated = false;
  constructor(private authService: AuthService) {}
  serviceError: any;
  subscription: Subscription;
  ngOnInit() {
    this.subscription = this.authService.user.subscribe((data) => {
      this.isAuthenticated = !data;
    });
  }
}
