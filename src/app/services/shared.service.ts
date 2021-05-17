import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { AuthErrorsComponent } from '../shared/snackbar/auth-errors/auth-errors.component';
import { AuthSnackbarComponent } from '../shared/snackbar/auth-snackbar/auth-snackbar.component';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  durationInSeconds = 3;
 
  constructor(private snackBar: MatSnackBar) {}
  /* Show skacnbar message */
  showMessageAfterSucces() {
    this.snackBar.openFromComponent(AuthSnackbarComponent, {
      duration: this.durationInSeconds * 1000,
      panelClass: ['blue-snackbar'],
    });
  }
/* Show SnackBar with errors in auth */
  showMessageAfterError(){
    this.snackBar.openFromComponent(AuthErrorsComponent,  {
      duration: this.durationInSeconds * 1000,
      panelClass: ['blue-snackbar'],
    })
  }
}