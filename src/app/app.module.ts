import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { RegisterComponent } from './auth/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { FlexLayoutModule } from "@angular/flex-layout";
import {MatListModule} from "@angular/material/list";
import {MatSidenavModule} from "@angular/material/sidenav";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { NewRecipeComponent } from './recipes/new-recipe/new-recipe.component';
import { RecipesComponent } from './recipes/recipes.component';
import { AuthSnackbarComponent } from './shared/snackbar/auth-snackbar/auth-snackbar.component';
import {MatTableModule} from '@angular/material/table'
import { ShortenPipe } from './shared/shorten.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogConfirmComponent } from './shared/dialog-confirm/dialog-confirm.component';
import { HeaderComponent } from './header/header.component';
import { HttpErrorInterceptor } from './shared/interceptors/http-error.interceptor';
import { AuthErrorsComponent } from './shared/snackbar/auth-errors/auth-errors.component';
const modules = [
  BrowserModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  MatSliderModule,
  MatButtonModule,
  MatToolbarModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  MatSnackBarModule,
  MatSidenavModule,
  MatListModule,
  FlexLayoutModule,
  NgbModule,
  MatTableModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatDialogModule
  
];
@NgModule({
  declarations: [
    AppComponent,
    RecipeListComponent,
    NewRecipeComponent,
    LoginComponent,
    HeaderComponent,
    RegisterComponent,
    AuthSnackbarComponent,
    RecipesComponent,
    ShortenPipe,
    RecipeEditComponent,
    DialogConfirmComponent,
    AuthErrorsComponent,
  ],
  imports: modules,
  exports: modules,
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
