import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field/form-field-control';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { RegisterUserResponse } from 'src/app/shared/models/register-user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  authObservable: Observable<RegisterUserResponse>;
  error: string = null;
  collapsed = true;
  constructor(private authService: AuthService,private sharedService: SharedService, private router: Router) {}

  ngOnInit() {
    this.initForm();
  }
  private initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }
  onSubmit() {
    this.authObservable = this.authService.loginUser(
      this.loginForm.value.email,
      this.loginForm.value.password
    );
    this.authObservable.pipe(finalize(() => {
      if(this.error){
        this.sharedService.showMessageAfterError();
      }
      else{
        this.sharedService.showMessageAfterSucces();
      }
    })).subscribe(
      (resData) => {
        this.router.navigate(['/recipes']);
      },
      (errorMessage) => {
        this.error = errorMessage;
      }
    );
     
  }
}
