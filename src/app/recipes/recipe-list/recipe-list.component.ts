import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { DataStorageService } from 'src/app/services/data-storage.service';
import { DialogConfirmComponent } from 'src/app/shared/dialog-confirm/dialog-confirm.component';
import { Recipes } from 'src/app/shared/models/recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, AfterViewInit {
  constructor(
    private dataService: DataStorageService,
    private matSnackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}
  DATA_RECIPE: Recipes[] = [];
  tableColumns: string[] = [
    'imageUrl',
    'name',
    'description',
    'ingrediends',
    'actions',
  ];
  confirmDialogRef!: MatDialogRef<DialogConfirmComponent>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource();
  changed: any;
  recipeId: any;
  selectedIndex = this.dataService.selectedIndex;
  subscription: Subscription;
  @ViewChild(MatSort)
  sort!: MatSort;
  count: number | null = 0;
  isLoadingResults: boolean = true;
  isUpdated: boolean = false;
  changedRecipe: any;
  pageNumber = 1;
  pageSize = 8;
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit() {
     this.dataService.recipesChanged
      .pipe(
        tap((el) => {
          if (el.length !== 0) {
            this.isUpdated = true;
            this.changedRecipe = el;
          }
        })
      )
      .subscribe(); 
    this.getRecipes();
  }
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  update() {}
  getRecipes(): void {
    this.dataService
      .getRecipes()
      .pipe(
        tap((response: any) => {
          if (response != null || response != undefined) {
            const objVal = Object.entries(response);
            this.count = Object.values(response).length;
            objVal.forEach((recipe: any) => {
              this.pushingRecipes(recipe);
            });
             if (this.isUpdated) {
              this.DATA_RECIPE.splice(this.selectedIndex, 1, this.changedRecipe[0]
              );
            } 
            this.shortenIngredientsView();
          } else {
            this.matSnackBar.open('There are no results!😞 Perhaps try to add a new Recipe', 'close', {
              duration: 3000,
              panelClass: 'blue-snackbar',
            });
          }
        }),
        finalize(() => {
          this.dataSource.data = this.DATA_RECIPE;
          this.isLoadingResults = false;
        })
      )
      .subscribe();
  }
  deleteSelectedRecipe(recipe: Recipes) {
    this.confirmDialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        message: `Confirm the recipe deletion of ${recipe.name} before you regret🙄`,
        title: 'Are you sure',
        buttonText: 'Confirm',
        buttonColor: 'accent',
      }, panelClass: 'custom-modalbox'
    });
    this.confirmDialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.isLoadingResults = true;
        this.dataService
          .deleteRecipeById(recipe.id)
          .pipe(
            tap(() => {
              this.matSnackBar.open('Recipe successfully deleted 🗑️', 'Close', {
                duration:3000,
                panelClass: 'blue-snackbar',
              });
            }),
            finalize(()=>{  this.isLoadingResults = false;
              this.DATA_RECIPE = [];
              this.getRecipes();
            })
          )
          .subscribe();
      } else {
        console.log('no response');
      }
    });
  }

  private pushingRecipes(recipe: any) {
    const recipeValues = recipe[1];
    const recipeKeys = recipe[0];
    this.DATA_RECIPE.push({
      id: recipeKeys,
      name: recipeValues.name,
      description: recipeValues.description,
      imageUrl: recipeValues.imageUrl,
      ingrediends: recipeValues.ingrediends,
    });
  }
  editRecipes(id: string, index: number) {
    this.router.navigate([`edit/${id}`], {
      relativeTo: this.route,
    });
    this.selectedIndex = index;
  }
  private shortenIngredientsView() {
    for (let i in this.DATA_RECIPE) {
      let ingredientArray = this.DATA_RECIPE[i].ingrediends;
      if (ingredientArray) {
        if (ingredientArray.length > 2) {
          this.changed = ingredientArray.slice(0, 2);
          this.DATA_RECIPE[i].ingrediends = this.changed;
        } else {
          this.changed = ingredientArray;
        }
      }
    }
  }
}
