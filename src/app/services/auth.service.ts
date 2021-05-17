import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  RegisterUserResponse,
  User,
} from '../shared/models/register-user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  user = new BehaviorSubject<User>(null);
  errorEvent = new BehaviorSubject<string>(null);
  errorMessage: string;
  error: any;
  private tokenExpirationTimer: any;
  constructor(private httpClient: HttpClient, private router: Router) {}
  registerUser(email: string, password: string) {
    return this.httpClient
      .post<RegisterUserResponse>(
        `${this.apiUrl}signUp?key=AIzaSyDRA8ZkRDYTek5yOGfxiE2dvhf0bc2XECY`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
      //  catchError(this.handleError),
        tap((resData) => {
          this.handleAuth(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }
  loginUser(email: string, password: string) {
    return this.httpClient
      .post<RegisterUserResponse>(
        `${this.apiUrl}signInWithPassword?key=AIzaSyDRA8ZkRDYTek5yOGfxiE2dvhf0bc2XECY`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
     //   catchError(this.handleError),
        tap((resData) => {
          this.handleAuth(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
    }
  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }
  logout() {
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }
  autoLogout(expirationDate: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDate);
  }
  private handleAuth(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  public handleError(errorResponse: HttpErrorResponse) {
    /* this.errorMessage = 'An unknown error occurred!';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(this.errorMessage);
    }
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        this.errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        this.errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        this.errorMessage = 'This password is not correct.';
        break;
      case 'INVALID_EMAIL':
        this.errorMessage = 'This email is not correct.';
    }
    return throwError(this.errorMessage); */
  }
 
}
