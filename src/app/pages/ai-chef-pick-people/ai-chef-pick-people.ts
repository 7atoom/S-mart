import {
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AiChefService } from '../../core/services/ai-chef.service';
import { RecipeIngredient } from '../../utils/AiChefRecipe';
import { CurrencyPipe } from '@angular/common';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-ai-chef-pick-people',
  templateUrl: './ai-chef-pick-people.html',
  styleUrl: './ai-chef-pick-people.css',
  imports: [CurrencyPipe, LottieComponent],
})
export class AiChefPickPeople {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private aiChefService = inject(AiChefService);

  servings = 1;
  presets = [1, 2, 4, 6, 8];

  /** Populated from the route param — acts as the "isFetching" trigger.
   *  resource() only fires when dishName() is non-empty (truthy). */
  dishName = signal('');

  // ---------------------------------------------------------------
  // Lottie options
  // ---------------------------------------------------------------
  lottieOptions: AnimationOptions = {
    path: '/loader/loader.json',
  };

  // ---------------------------------------------------------------
  // Storytelling timer
  // ---------------------------------------------------------------
  private readonly MESSAGES = [
    'Analyzing ingredients...',
    'Consulting the chef...',
    'Plating your recipe...',
  ];

  private storytellingIndex = signal(0);
  storytellingText = computed(() => this.MESSAGES[this.storytellingIndex()]);

  // ---------------------------------------------------------------
  // rxResource() — only fires when dishName() is non-empty
  // ---------------------------------------------------------------
  recipeResource = rxResource({
    params: () => (this.dishName() ? { dish: this.dishName() } : undefined),
    stream: ({ params }) => this.aiChefService.generateRecipe(params.dish),
  });

  // ---------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------
  constructor() {
    // 1. Set dishName from the route param, which triggers the resource
    const dish = this.route.snapshot.paramMap.get('selectedRecipe') || '';
    this.dishName.set(dish);

    // 2. Cycle storytelling messages while loading; clear on done/error
    let timer: ReturnType<typeof setInterval> | null = null;

    effect(() => {
      if (this.recipeResource.isLoading()) {
        // Reset index and start the cycling interval
        this.storytellingIndex.set(0);
        timer = setInterval(() => {
          this.storytellingIndex.update((i) =>
            Math.min(i + 1, this.MESSAGES.length - 1)
          );
        }, 2000);
      } else {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      }
    });
  }

  // ---------------------------------------------------------------
  // Convenience getters (delegate to resource value)
  // ---------------------------------------------------------------
  get recipe(): RecipeIngredient[] {
    return this.recipeResource.value()?.recipe ?? [];
  }

  get foundIngredients(): RecipeIngredient[] {
    return this.recipe.filter((i) => i.found);
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
      state: { recipe: this.recipe, servings: this.servings },
    });
  }

  /** Retry after an error */
  retry() {
    this.recipeResource.reload();
  }
}
