import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, map, takeUntil, tap } from 'rxjs/operators';
import { DataStorageService } from 'src/app/services/data-storage.service';
import { Recipes } from 'src/app/shared/models/recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  editedForm: FormGroup;
  private onComponentDestroy: Subject<void> = new Subject<void>();
  selectedRecipeId: string | undefined;
  isChangedIngName: boolean[]= [];
  isChangedIngAmount: boolean[] = [];
  isChangedFormFields: boolean;
  selectedRecipeIdString = '';
  selectedIndex: number | undefined;
  selectedRecipe: Recipes[]=[];
  recipes: Recipes[]=[];
  recipeName: string;
  isLoadingResults: boolean = true;
  constructor(
    private dataStorage: DataStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.onFormStart();
    console.log("indexiii", this.recipes);
    if (this.route.snapshot.params.id) {
      this.getRecipesById(this.route.snapshot.params.id);
    }
  }
  ngOnDestroy(): void {
    this.onComponentDestroy.next();
    this.onComponentDestroy.complete();
  }
  onFormStart(): void {
    this.editedForm = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      imageUrl: new FormControl(''),
      ingrediends: new FormArray([]),
    });
  }

  getRecipesById(id: string) {
    this.selectedRecipeId = id;
    this.dataStorage
      .getRecipesById(id)
      .pipe(
        tap((selectedRecipe) => {
          this.selectedRecipe = selectedRecipe;
          return this.fillForm(selectedRecipe);
        }),
        finalize(()=>{
          this.isLoadingResults = false;
        })
      )
      .subscribe();
  }
  fillForm(recipe: Recipes[]) {
    let editedIngrediends = new FormArray([]);
    if (recipe['ingrediends']) {
      for (let ingredient of recipe['ingrediends']) {
        editedIngrediends.push(
          new FormGroup({
            name: new FormControl(ingredient.name),
            amount: new FormControl(ingredient.amount),
          })
        );
      }
    }
    this.editedForm.get('name')?.setValue(recipe['name']);
    this.editedForm.get('description')?.setValue(recipe['description']);
    this.editedForm.get('imageUrl')?.setValue(recipe['imageUrl']);
    let name: any;
    let amount: any;
    editedIngrediends.controls.forEach((formArrayEl, index) => {
      this.editedForm.get('ingrediends')['controls'].push(formArrayEl);
      name = recipe['ingrediends'][index].name;
      amount = recipe['ingrediends'][index].amount;
    });
    this.editedForm.get('ingrediends')?.patchValue([name, amount]);
  }

  onDeleteIngrediends(i: number) {
    let ingrediendsArr = this.editedForm.get('ingrediends')['controls'];
    ingrediendsArr.splice(i, 1);
  }
  onAddIngredients() {
    (<FormArray>this.editedForm.get('ingrediends')).push(
      new FormGroup({
        name: new FormControl(null),
        amount: new FormControl(null),
      })
    );
  }
  onUpdate() {
    let name: any;
    let amount: any;
    this.recipeName =this.editedForm.value.name;
    this.editedForm.get('ingrediends')['controls'].forEach((formArrayElement, index) => {
      this.editedForm.get('ingrediends')['controls'].splice(index, 1, formArrayElement);
      name = this.editedForm.controls.ingrediends['controls'][index].controls.name.value;
      amount = this.editedForm.controls.ingrediends['controls'][index].controls.amount.value;
      this.isChangedIngName.push(this.editedForm.controls.ingrediends['controls'][index].controls.name.dirty);
      this.isChangedIngAmount.push(this.editedForm.controls.ingrediends['controls'][index].controls.amount.dirty);
  
    });
    this.isChangedFormFields = this.editedForm.dirty;
    this.editedForm.get('ingrediends')?.patchValue([name, amount]);
    if( this.isChangedIngAmount.includes(true) || this.isChangedIngName.includes(true)  || this.isChangedFormFields){
      this.dataStorage.updateRecipes(this.selectedRecipeId, this.editedForm.value).pipe(
        tap(response=>{
          if(response){
            this.onSaveMessage();
          }
        })
      ).subscribe();
      this.router.navigate(['../'], {relativeTo: this.route})
     }
     else{
      this.onNotificationMessage();
     }
 
  }
  onSaveMessage() {
    this.matSnackBar.open(`Recipe ${this.recipeName}  successfully updated! 😄`, 'Close', {
      duration: 3000,
      panelClass: 'blue-snackbar',
    });
  }
  onNotificationMessage(){
    this.matSnackBar.open('You have not changed any field! 😟', 'Close', {
      duration: 3000,
      panelClass: "notification-snackbar"
    })
  }

}
