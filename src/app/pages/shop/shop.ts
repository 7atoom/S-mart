import { CommonModule, NgClass } from '@angular/common';
import {Component, computed, inject, OnInit, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { products } from '../../data/products';
// import { categories } from '../../data/products';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../utils/Product';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import {CategoriesService} from '../../core/services/categories.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [NgClass, FormsModule, ProductCard, RouterLink, CommonModule],
  templateUrl: './shop.html',
  styles: ``,
})
export class Shop implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  cartService = inject(CartService);
  categoriesService = inject(CategoriesService);
  activeCategory = signal<string>('All');
  sortBy = signal<string>('default');

  categories = this.categoriesService.categories;
  isLoadingCategories = this.categoriesService.isLoading;
  isErrorCategories = this.categoriesService.isError;

  allProducts = products;

  ngOnInit() {
    this.categoriesService.getCategories().subscribe();

    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.setActiveCategory(params['category']);
      }
    });

    this.router.events.subscribe(() => {
      window.scrollTo(0, 0);
    });
  }

  filteredProducts = computed(() => {
    let filtered = this.allProducts;

    if (this.activeCategory() !== 'All') {
      filtered = filtered.filter(p => p.category === this.activeCategory());
    }

    const sorted = [...filtered];
    switch (this.sortBy()) {
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

    console.log(sorted);
    return sorted;
  });


  setActiveCategory(cat: string) {
    this.activeCategory.set(cat);
  }

  retryCategories() {
    this.categoriesService.isError.set(false);
    this.categoriesService.getCategories().subscribe();
  }


  setSortBy(sort: string) {
    this.sortBy.set(sort);
    console.log(`Sort by: ${sort}`);
  }

  onAddToCart(product: Product) {
    this.cartService.addItem(product);
  }

  onUpdateQuantity(data: { productId: string; quantity: number }) {
    this.cartService.updateQuantity(data.productId, data.quantity);
  }

  getCartItem(productId: string) {
    return this.cartService.getCartItem(productId);
  }
}
