import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-shop',
  imports: [NgClass],
  templateUrl: './shop.html',
  styles: ``,
})
export class Shop {
  categories = [
    'All',
    'Ramadan Essentials',
    'Vegetables & Fruits',
    'Meat & Poultry',
    'Dairy & Eggs',
    'Bakery',
    'Pantry Staples',
    'Spices & Herbs',
    'Beverages',
    'Snacks',
  ];
  activeCategory: string = 'All';

  setActiveCategory(cat: string) {
    this.activeCategory = cat;
  }
}
