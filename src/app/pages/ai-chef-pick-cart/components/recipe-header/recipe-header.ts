import {Component, inject, Input} from '@angular/core';
import {Router} from '@angular/router';
import { Recipe } from '../../../../utils/Recipe';

@Component({
  selector: 'app-recipe-header',
  imports: [],
  templateUrl: './recipe-header.html',
  styleUrl: '../../ai-chef-pick-cart.css',
})
export class RecipeHeader {
  private router = inject(Router);

  @Input({ required: true }) meal = '';
  @Input({ required: true }) selectedRecipe!: Recipe;
  @Input({ required: true }) servings = 0;

  backToServings(): void {
    this.router.navigate(['aiChef', this.meal]);
  }
}
