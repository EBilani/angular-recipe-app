import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { DataStorageService } from 'src/app/services/data-storage.service';

@Component({
  selector: 'app-new-recipe',
  templateUrl: './new-recipe.component.html',
  styleUrls: ['./new-recipe.component.css'],
})
export class NewRecipeComponent implements OnInit {
  newRecipe: FormGroup;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  constructor(
    private dataService: DataStorageService,
    private matSnackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initForm();
  }
  initForm() {
    let recipeName = '';
    let recipeimageUrl = '';
    let recipeDescription = '';
    let ingrediend = new FormArray([]);
    ingrediend.push(
      new FormGroup({
        name: new FormControl(null),
        amount: new FormControl(null),
      })
    );
    this.newRecipe = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      imageUrl: new FormControl(recipeimageUrl),
      ingrediends: ingrediend,
    });
  }
  onAddIngrediends() {
    (<FormArray>this.newRecipe.get('ingrediends')).push(
      new FormGroup({
        name: new FormControl(null),
        amount: new FormControl(null),
      })
    );
  }
  onDeleteIngrediends(i: number) {
    let ingrediendsArr = this.newRecipe.get('ingrediends')['controls'];
    ingrediendsArr.splice(i, 1);
  }
  onSaveMessage() {
    this.matSnackBar.open('Recipe  successfully saved!', 'Close', {
      duration: 3000,
      panelClass: 'blue-snackbar',
    });
  }
  onSubmit() {
    this.dataService.saveRecipes(this.newRecipe.value).subscribe();
    this.onSaveMessage();
    this.newRecipe.reset();
    this.formDirective.resetForm();
    this.newRecipe.setControl('ingrediends', new FormArray([]));
  }
}
