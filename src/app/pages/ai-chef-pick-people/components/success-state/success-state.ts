import {Component, inject, input, model} from '@angular/core';
import {DecimalPipe} from "@angular/common";
import {Router} from '@angular/router';
import {RecipeIngredient} from '../../../../utils/AiChefRecipe';

@Component({
  selector: 'app-success-state',
    imports: [
        DecimalPipe
    ],
  templateUrl: './success-state.html',
  styles: ``,
})
export class SuccessState {
  // Two-way binding for servings
  servings = model.required<number>();

  // Input signals
  dishName = input.required<string>();
  recipe = input.required<RecipeIngredient[]>();
  scaledQty = input.required<(ingredient: RecipeIngredient) => number>();
  totalPrice = input.required<number>();

  router = inject(Router);
  presets = [1, 2, 4, 6, 8];

  decrease() {
    this.servings.update(s => Math.max(1, s - 1));
  }

  increase() {
    this.servings.update(s => Math.min(20, s + 1));
  }

  setServings(n: number) {
    this.servings.set(n);
  }

  back() {
    this.router.navigate(['aiChef/']);
  }

  continue() {
    this.router.navigate(['aiChef', this.dishName(), 'cart'], {
      queryParams: { servings: this.servings() },
      state: { recipe: this.recipe(), servings: this.servings() },
    });
  }
}
