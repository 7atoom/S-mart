import { CommonModule, NgClass } from '@angular/common';
import {Component, computed, inject, OnInit, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../utils/Product';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import {CategoriesService} from '../../core/services/categories.service';
import {ProductsService} from '../../core/services/products.service';
import {SearchPipe} from '../../shared/pipes/search.pipe';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [NgClass, FormsModule, ProductCard, RouterLink, CommonModule,SearchPipe],
  templateUrl: './shop.html',
  styles: ``,
})
export class Shop implements OnInit {
  searchText:string =""
  router = inject(Router);
  route = inject(ActivatedRoute);
  cartService = inject(CartService);
  categoriesService = inject(CategoriesService);
  productsService = inject(ProductsService);
  activeCategory = signal<string>('All');
  sortBy = 'default';

  categories = this.categoriesService.categories;
  isLoadingCategories = this.categoriesService.isLoading;
  isErrorCategories = this.categoriesService.isError;

  allProducts = this.productsService.products;
  isLoadingProducts = this.productsService.isLoading;
  isErrorProducts = this.productsService.isError;

  ngOnInit() {
    this.categoriesService.getCategories().subscribe();
    this.productsService.getProducts().subscribe();
    this.cartService.getCart();

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
    let filtered = this.allProducts();
    if (!Array.isArray(filtered)) filtered = [];

    if (this.activeCategory() !== 'All') {
      filtered = filtered.filter(p => p.category.name === this.activeCategory());
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
    this.sortBy = sort;
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
