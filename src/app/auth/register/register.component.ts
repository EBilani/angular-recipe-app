import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { RegisterUserResponse } from 'src/app/shared/models/register-user.model';
import { MyErrorStateMatcher } from '../pass-check-match';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  registerMode = false;
  error: string = null;
  authObservable: Observable<RegisterUserResponse>;
  constructor(private authService: AuthService,private sharedService: SharedService, private router: Router) {}
  ngOnInit() {
    this.initForm();
  }
  private initForm() {
    this.registerForm = new FormGroup(
      {
        email: new FormControl(null, [Validators.email, Validators.required]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
        confirm_password: new FormControl(null, Validators.required),
      },
      { validators: this.checkPasswords }
    );
  }
  checkPasswords(group: FormGroup) {
    let pass = group.get('password').value;
    let confirm_pass = group.get('confirm_password').value;
    return pass === confirm_pass ? null : { notSame: true };
  }
  onSubmit() {
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    this.authObservable = this.authService.registerUser(email, password);
    this.authObservable
      .pipe(
        finalize(() => {
          if(this.error){
          return  this.sharedService.showMessageAfterError();
          }
          else{
          return  this.sharedService.showMessageAfterSucces();
          }
        })
      )
      .subscribe(
        (resData) => {
          this.router.navigate(['/recipes']);
        },
        (errorMessage) => {
          this.error = errorMessage;
        }
      );
  }
}
