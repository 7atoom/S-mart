import {Component, inject, OnInit, signal} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { RecipeIngredient } from '../../utils/AiChefRecipe';
import {CartIngredient} from '../../utils/CartIngredient';

@Component({
  selector: 'app-ai-chef-pick-cart',
  imports: [DecimalPipe],
  templateUrl: './ai-chef-pick-cart.html',
  styleUrl: './ai-chef-pick-cart.css',
})
export class AiChefPickCart implements OnInit {
  meal = '';
  servings = 1;

  recipe = {
    title: '',
    description: 'Perfectly Ful Medames with a Lemon compound butter of fresh herbs.',
    time: '30 mins',
    difficulty: 'medium',
  };

  ingredients = signal<CartIngredient[]>([]);
  isAddingToCart = signal(false);

  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    this.meal = this.route.snapshot.paramMap.get('selectedRecipe') || '';

    const state = history.state as { recipe?: RecipeIngredient[]; servings?: number };
    const recipeItems: RecipeIngredient[] = state?.recipe ?? [];

    const q = this.route.snapshot.queryParamMap.get('servings');
    this.servings = state?.servings ?? (q ? Number(q) : 2);

    this.recipe.title = this.meal;

    this.ingredients.set(
      recipeItems
        .filter(i => i.found && i.product)
        .map(i => ({
          productId: i.product!._id,
          name: i.product!.title,
          baseQuantity: i.requiredQuantity,
          quantityInGram: i.product!.quantityInGram,
          unit: i.product!.unit,
          price: i.product!.price,
          image: i.product!.image,
          selected: true,
        }))
    );
  }

  scaledQty(item: CartIngredient): number {
    const gramsNeeded = (item.baseQuantity / 2) * this.servings;
    const packsNeeded = gramsNeeded / (item.quantityInGram || 1);
    return Math.max(1, Math.ceil(packsNeeded));
  }

  get totalPrice(): number {
    return +this.ingredients()
      .filter(i => i.selected)
      .reduce((sum, i) => sum + i.price * this.scaledQty(i), 0)
      .toFixed(2);
  }

  get itemCount(): number {
    return this.ingredients().filter(i => i.selected).length;
  }

  get selectedIngredients(): CartIngredient[] {
    return this.ingredients().filter(i => i.selected);
  }

  toggleItem(item: CartIngredient): void {
    this.ingredients.update(list =>
      list.map(i => i.productId === item.productId ? { ...i, selected: !i.selected } : i)
    );
  }

  backToServings(): void {
    this.router.navigate(['aiChef', this.meal]);
  }

  weCookIt(): void {
    this.router.navigate(['cart']);
  }

  addToCart(): void {
    const selected = this.selectedIngredients;
    if (!selected.length) return;

    this.isAddingToCart.set(true);

    const cartItems: any[] = selected.map(item => ({
      _id: item.productId,
      productId: item.productId,
      name: item.name,
      title: item.name,
      price: item.price,
      image: item.image,
      weight: item.unit,
      quantity: this.scaledQty(item),
      category: '',
      recipeGroup: this.meal,
    }));

    this.cartService.addItems(cartItems);
    this.isAddingToCart.set(false);
    this.router.navigate(['cart']);
  }
}
