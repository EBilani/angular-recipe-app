import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-auth-errors',
  templateUrl: './auth-errors.component.html',
  styleUrls: ['./auth-errors.component.css'],
})
export class AuthErrorsComponent implements OnInit, AfterViewInit {
  message: string;
  @ViewChild('myButton') el: ElementRef;
  constructor(
    private authService: AuthService,
    private _snackRef: MatSnackBarRef<AuthErrorsComponent>,
    private ren: Renderer2
  ) {}
  ngAfterViewInit() {
    let snackEl = this.el.nativeElement;
    this.ren.listen(snackEl, 'click', () => {
      this.dismiss();
    });
  }

  ngOnInit() {
    this.authService.errorEvent.subscribe((el) => {
      switch (el) {
        case 'EMAIL_EXISTS':
          el = 'This email exists already!';
          break;
        case 'EMAIL_NOT_FOUND':
          el = 'This email does not exist!';
          break;
        case 'INVALID_PASSWORD':
          el = 'This password is not correct!';
          break;
        case 'INVALID_EMAIL':
          el = 'This email is not correct!';
          break;
        case 'TOO_MANY_ATTEMPTS_TRY_LATER : Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.':
          el = 'Access to this account has been temporarily disabled due to many failed login attempts. You can try again later.';
          break;
        default:
           el = 'An unknown error occurred!';
      }
      this.message = el;
    });
  }
  dismiss() {
    this._snackRef.dismiss();
  }
}
