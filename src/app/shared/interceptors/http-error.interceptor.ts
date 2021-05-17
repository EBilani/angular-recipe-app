import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private matSnackBar: MatSnackBar,private sharedService: SharedService ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: Error | HttpErrorResponse) => {
              if (error instanceof HttpErrorResponse) {
                if (error.status === 401  && this.authService.user) {
                  this.authService.logout();
                } else if (error.error && (error.error.Message || error.error.title) || error.message) {
                  this.authService.errorEvent.next(error.error.error.message);
                  console.log("ererererere", error.error.error.message);
                }
              }
              return throwError(error);
            })
          );
    }
}
