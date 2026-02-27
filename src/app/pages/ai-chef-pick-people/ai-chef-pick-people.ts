import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Ingredient {
  name: string;
  price: number;
}

interface Recipe {
  id: number;
  title: string;
  ingredients: Ingredient[];
}

@Component({
  selector: 'app-ai-chef-pick-people',
  templateUrl: './ai-chef-pick-people.html',
  styleUrl: './ai-chef-pick-people.css',
})
export class AiChefPickPeople implements OnInit {
  servings = 2;
  presets = [1, 2, 4, 6, 8, 10];

  searchTerm: string = '';
  selectedRecipe: number = 0;

  selectedRecipeId = 0;
  currentRecipe!: Recipe;

  recipes: Recipe[] = [
    {
      id: 1,
      title: 'Grilled Ribeye with Herb Butter',
      ingredients: [
        { name: 'Beef', price: 20 },
        { name: 'Butter', price: 5 },
        { name: 'Herbs', price: 3 },
        { name: 'Salt', price: 1 },
        { name: 'Pepper', price: 2 },
      ],
    },
    {
      id: 2,
      title: 'Classic Pasta Carbonara',
      ingredients: [
        { name: 'Pasta', price: 5 },
        { name: 'Eggs', price: 4 },
        { name: 'Cheese', price: 6 },
        { name: 'Guanciale', price: 8 },
      ],
    },
    {
      id: 3,
      title: 'Fresh Caprese Salad',
      ingredients: [
        { name: 'Pasta', price: 5 },
        { name: 'Eggs', price: 4 },
        { name: 'Cheese', price: 6 },
        { name: 'Guanciale', price: 8 },
      ],
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.selectedRecipeId = Number(this.route.snapshot.paramMap.get('selectedRecipe')) || 1;
    this.searchTerm = this.route.snapshot.paramMap.get('meal') || '';
    this.currentRecipe = this.recipes.find((r) => r.id === this.selectedRecipeId)!;
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

  get totalPrice(): number {
    const base = this.currentRecipe.ingredients.reduce((s, i) => s + i.price, 0);
    return +(base * (this.servings / 2)).toFixed(2);
  }

  back() {
    this.router.navigate(['aiChef', this.searchTerm]);
  }

  continue() {
    this.router.navigate(['aiChef', this.searchTerm, this.selectedRecipeId, 'cart'], {
      queryParams: { servings: this.servings },
    });
  }
}
