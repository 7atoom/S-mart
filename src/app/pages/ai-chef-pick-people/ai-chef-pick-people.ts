import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AiChefService } from '../../core/services/ai-chef.service';
import { RecipeIngredient } from '../../utils/AiChefRecipe';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-ai-chef-pick-people',
  templateUrl: './ai-chef-pick-people.html',
  styleUrl: './ai-chef-pick-people.css',
  imports: [
    CurrencyPipe
  ]
})
export class AiChefPickPeople implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private aiChefService = inject(AiChefService);

  servings = 1;
  presets = [1, 2, 4, 6, 8];

  dishName = signal('');
  recipe = signal<RecipeIngredient[]>([]);
  isLoading = signal(false);
  isError = signal(false);

  ngOnInit(): void {
    const dish = this.route.snapshot.paramMap.get('selectedRecipe') || '';
    this.dishName.set(dish);
    this.loadRecipe(dish);
  }

  loadRecipe(dish: string) {
    this.isLoading.set(true);
    this.isError.set(false);
    this.aiChefService.generateRecipe(dish).subscribe({
      next: (res) => {
        this.recipe.set(res.recipe);
        this.isLoading.set(false);
      },
      error: () => {
        this.isError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  get foundIngredients(): RecipeIngredient[] {
    return this.recipe().filter(i => i.found);
  }

  scaledQty(ingredient: RecipeIngredient): number {
    const product = ingredient.product!;
    const gramsNeeded = (ingredient.requiredQuantity / 2) * this.servings;
    const packsNeeded = gramsNeeded / (product.quantityInGram || 1);
    return Math.max(1, Math.ceil(packsNeeded));
  }

  get totalPrice(): number {
    const total = this.foundIngredients.reduce(
      (sum, i) => sum + (i.product?.price ?? 0) * this.scaledQty(i),
      0
    );
    return +total.toFixed(2);
  }

  decrease() {
    this.servings = Math.max(1, this.servings - 1);
  }

  increase() {
    this.servings = Math.min(20, this.servings + 1);
  }

  setServings(n: number) {
    this.servings = n;
  }

  back() {
    this.router.navigate(['aiChef']);
  }

  continue() {
    this.router.navigate(['aiChef', this.dishName(), 'cart'], {
      queryParams: { servings: this.servings },
      state: { recipe: this.recipe(), servings: this.servings },
    });
  }
}
