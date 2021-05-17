import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Recipes } from '../shared/models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
   recipes: Recipes[]= [];
   selectedIndex: number;
   recipesChanged = new BehaviorSubject<Recipes[]>(this.recipes);
  constructor(private httpClient: HttpClient) { }

  saveRecipes(recipes: Recipes){
  return  this.httpClient.post("https://my-recipe-app-52a42-default-rtdb.firebaseio.com/recipes.json", recipes)
  }
 public getRecipes =  (): Observable<Recipes[]>=>{
   const request =  this.httpClient.get<Recipes[]>("https://my-recipe-app-52a42-default-rtdb.firebaseio.com/recipes.json") ;
   return request;
 }
 
 public getRecipesById =  (id? :string | null, PAGE_SIZE?: number| null): Observable<Recipes[]>=>{
  const request =  this.httpClient.get<Recipes[]>(`https://my-recipe-app-52a42-default-rtdb.firebaseio.com/recipes/${id}.json`) ;
  return request;
}
 updateRecipes(id:string, recipe: Recipes){
 const request  = this.httpClient.patch<Recipes[]>(`https://my-recipe-app-52a42-default-rtdb.firebaseio.com/recipes/${id}.json`,recipe);
 this.recipes.splice(this.selectedIndex, 1, recipe);
 this.recipes[0].id = id;
 this.recipesChanged.next(this.recipes);
 return request;
 }
 deleteRecipeById(id: string){
   const request = this.httpClient.delete<Recipes[]>(`https://my-recipe-app-52a42-default-rtdb.firebaseio.com/recipes/${id}.json`);
   return request;
 }
}
