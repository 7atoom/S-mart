import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

interface CartIngredient {
  name: string;
  quantity: string;
  price: number;
  emoji: string;
  selected: boolean;
}

@Component({
  selector: 'app-ai-chef-pick-cart',
  imports: [DecimalPipe],
  templateUrl: './ai-chef-pick-cart.html',
  styleUrl: './ai-chef-pick-cart.css',
})
export class AiChefPickCart implements OnInit {
  meal = '';
  selectedRecipeId = 1;
  servings = 2;

  recipe = {
    title: 'Grilled Ribeye with Herb Butter',
    description:
      'Perfectly seared steak with a melting compound butter of fresh herbs.',
    time: '35 min',
    difficulty: 'Hard',
  };

  /** Fake ingredients for final review (matches React example structure) */
  ingredients: CartIngredient[] = [
    { name: 'Ribeye Steak', quantity: '2 × 350g', price: 37.98, emoji: '🥘', selected: true },
    { name: 'Fresh Rosemary', quantity: '30g', price: 2.99, emoji: '🥘', selected: true },
    { name: 'Smoked Paprika', quantity: '1 tsp', price: 4.49, emoji: '🥘', selected: true },
    {
      name: 'Extra Virgin Olive Oil',
      quantity: '2 tbsp',
      price: 12.99,
      emoji: '🥘',
      selected: true,
    },
    { name: 'Free-Range Eggs', quantity: '2 eggs', price: 6.99, emoji: '🥘', selected: true },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.meal = this.route.snapshot.paramMap.get('meal') || '';
    this.selectedRecipeId = Number(
      this.route.snapshot.paramMap.get('selectedRecipe'),
    ) || 1;
    const q = this.route.snapshot.queryParamMap.get('servings');
    this.servings = q ? Number(q) : 2;
  }

  get totalPrice(): number {
    return this.ingredients
      .filter((i) => i.selected)
      .reduce((sum, i) => sum + i.price, 0);
  }

  get itemCount(): number {
    return this.ingredients.filter((i) => i.selected).length;
  }

  get selectedIngredients(): CartIngredient[] {
    return this.ingredients.filter((i) => i.selected);
  }

  toggleItem(item: CartIngredient): void {
    item.selected = !item.selected;
  }

  backToServings(): void {
    this.router.navigate(['aiChef', this.meal, this.selectedRecipeId]);
  }

  weCookIt(): void {
    // TODO: start "we cook it for you" flow
    this.router.navigate(['cart']);
  }

  addToCart(): void {
    const selected = this.selectedIngredients;
    console.log('Add to cart – selected items:', selected);
    this.router.navigate(['cart']);
    this.cartService.addItems(selected.map(i => ({
      id: i.name.toLowerCase().replace(/\s+/g, '-'), // simple ID generation
      name: i.name,
      price: i.price,
      quantity: 1, 
      weight: i.quantity, 
      image: '', 
    })));
  }
}
