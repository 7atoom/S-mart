import {Component, inject, signal,} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {RecipeIngredient} from '../../utils/AiChefRecipe';
import {Auth} from '../../core/services/auth.service';

@Component({
  selector: 'app-ai-chef',
  imports: [ReactiveFormsModule],
  templateUrl: './ai-chef.html',
  styleUrl: `./ai-chef.css`,
})
export class AiChef {
  router = inject(Router);
  authService = inject(Auth);

  recipe = signal<RecipeIngredient[]>([]);
  isLoading = signal(false);

  searchControl = new FormControl("",[Validators.required,Validators.minLength(3)]);
  suggestedMeals: string[] = ['steak','Biryani','Sushi','Pasta','Ful medames','Salad','Dessert'];
  cook(){
    console.log(this.searchControl.value);
    if(!this.authService.isAuthenticated()){
      this.router.navigate(['/login']);
      return;
    }
    if(this.searchControl.valid){
      this.router.navigate(['aiChef',this.searchControl.value]);
    }
  }
  setSearchControl(value:string){
    this.searchControl.setValue(value);
    this.cook();
  }
}
