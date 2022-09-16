import {Injectable} from "@angular/core";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {RecipeService} from "../recipes/recipe.service";
import {Recipe} from "../recipes/recipe.model";
import {map, tap} from "rxjs";

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient, private recipesService: RecipeService) {}
    // potrebujeme pristup do recipeservice abychom nacetli i jiz ulozene recepty

    storeRecipes() {
      const recipes = this.recipesService.getRecipes();
      return this.http
        .put(
          'https://recipe-course-project-846d3-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
          recipes)
        .subscribe(response => {
          console.log(response);
         });
    }

    fetchRecipes() {
      return this.http
        .get<Recipe[]>(
          'https://recipe-course-project-846d3-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
          )
        .pipe(map(recipes => {
          return recipes.map(recipe => {
            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
          //  vylepseni, aby kdyz vytvorime recept bez ingredienci, tak aby hodnota ingredienci nebyla null ale prazdny array
          });
        }),
          tap(recipes => {
            this.recipesService.setRecipes(recipes);
          })
        )
    }
  }

//  put umi pridat nova data i prepsat jiz ulozena data
