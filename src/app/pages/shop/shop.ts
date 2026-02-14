import { NgClass } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { products } from '../../data/products';
import { categories } from '../../data/products';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { CartService } from '../../core/services/cart.service';
import { Products } from '../../utils/Product';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [NgClass, FormsModule, ProductCard, RouterLink],
  templateUrl: './shop.html',
  styles: ``,
})
export class Shop {
  cartService = inject(CartService);
  activeCategory: string = 'All';
  sortBy: string = 'default';
  categories = categories;
  allProducts = products;

  filteredProducts = computed(() => {
    let filtered = this.allProducts;

    if (this.activeCategory !== 'All') {
      filtered = filtered.filter(p => p.category === this.activeCategory);
    }

    const sorted = [...filtered];
    switch (this.sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'default':
      default:
        sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return sorted;
  });


  setActiveCategory(cat: string) {
    this.activeCategory = cat;
  }

  setSortBy(sort: string) {
    this.sortBy = sort;
  }

  onAddToCart(product: Products) {
    this.cartService.addItem(product);
  }

  onUpdateQuantity(data: { productId: string; quantity: number }) {
    this.cartService.updateQuantity(data.productId, data.quantity);
  }

  getCartItem(productId: string) {
    return this.cartService.getCartItem(productId);
  }
}
