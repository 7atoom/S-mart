import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AiChefService } from '../../core/services/ai-chef.service';
import { RecipeIngredient } from '../../utils/AiChefRecipe';
import { rxResource } from '@angular/core/rxjs-interop';
import {LoadingState} from './components/loading-state/loading-state';
import {ErrorState} from './components/error-state/error-state';
import {SuccessState} from './components/success-state/success-state';

@Component({
  selector: 'app-ai-chef-pick-people',
  templateUrl: './ai-chef-pick-people.html',
  styleUrl: './ai-chef-pick-people.css',
  imports: [LoadingState, ErrorState, SuccessState],
})
export class AiChefPickPeople {
  private route = inject(ActivatedRoute);
  private aiChefService = inject(AiChefService);

  servings = signal(1);
  dishName = signal('');



  recipeResource = rxResource({
    params: () => (this.dishName() ? { dish: this.dishName() } : undefined),
    stream: ({ params }) => this.aiChefService.generateRecipe(params.dish),
  });

  constructor() {
    const dish = this.route.snapshot.paramMap.get('selectedRecipe') || '';
    this.dishName.set(dish);
  }

  recipe = computed(() => this.recipeResource.value()?.recipe ?? []);

  foundIngredients = computed(() => this.recipe().filter((i) => i.found));

  scaledQty = computed(() => (ingredient: RecipeIngredient) => {
    const product = ingredient.product!;
    const gramsNeeded = (ingredient.requiredQuantity / 2) * this.servings();
    const packsNeeded = gramsNeeded / (product.quantityInGram || 1);
    return Math.max(1, Math.ceil(packsNeeded));
  });

  totalPrice = computed(() => {
    const total = this.foundIngredients().reduce(
      (sum, i) => sum + (i.product?.price ?? 0) * this.scaledQty()(i),
      0
    );
    return +total.toFixed(2);
  });




}
