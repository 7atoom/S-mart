import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../core/services/products.service';
import { CategoriesService } from '../../core/services/categories.service';
import { Product } from '../../utils/Product';
import { Category } from '../../utils/Category';
import { AddProductBody } from '../../core/services/products.service';
import { ProductFormModal } from './components/product-form-modal/product-form-modal';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductFormModal],
  templateUrl: './dashboard.html',
  styles: ``,
})
export class Dashboard implements OnInit {
  private productsService = inject(ProductsService);
  private categoriesService = inject(CategoriesService);

  searchText = signal('');
  activeCategory = signal<string>('All');
  modalOpen = signal<'add' | 'edit' | null>(null);
  editingProduct = signal<Product | null>(null);

  products = this.productsService.products;
  categories = this.categoriesService.categories;
  isLoadingProducts = this.productsService.isLoading;
  isErrorProducts = this.productsService.isError;

  ngOnInit() {
    this.categoriesService.getCategories().subscribe();
    this.productsService.getProducts().subscribe();
  }

  stats = computed(() => {
    const list = this.products();
    const totalProducts = list.length;
    const catalogValue = list.reduce((sum, p) => sum + p.price, 0);
    const categoryIds = new Set(list.map(p => (p.category as Category)?._id ?? (p.category as unknown as string)));
    const categoryCount = categoryIds.size;
    return { totalProducts, catalogValue, categoryCount };
  });

  filteredByCategory = computed(() => {
    const list = this.products();
    const cat = this.activeCategory();
    if (!Array.isArray(list)) return [];
    if (cat === 'All') return list;
    return list.filter(p => (p.category as Category)?.name === cat);
  });

  filteredProducts = computed(() => {
    const list = this.filteredByCategory();
    const query = this.searchText().trim().toLowerCase();
    if (!query) return list;
    return list.filter(p =>
      p.title.toLowerCase().includes(query) ||
      ((p.category as Category)?.name ?? '').toLowerCase().includes(query)
    );
  });

  setActiveCategory(cat: string) {
    this.activeCategory.set(cat);
  }

  openAddModal() {
    this.editingProduct.set(null);
    this.modalOpen.set('add');
  }

  openEditModal(product: Product) {
    this.editingProduct.set(product);
    this.modalOpen.set('edit');
  }

  closeModal() {
    this.modalOpen.set(null);
    this.editingProduct.set(null);
  }

  onAddProduct(body: AddProductBody) {
    this.productsService.addProduct(body).subscribe({
      next: () => {
        this.closeModal();
        this.productsService.refreshProducts();
      },
      error: err => console.error(err),
    });
  }

  onUpdateProduct(body: Partial<AddProductBody>) {
    const product = this.editingProduct();
    if (!product) return;
    this.productsService.updateProduct(product._id, body).subscribe({
      next: () => {
        this.closeModal();
        this.productsService.refreshProducts();
      },
      error: err => console.error(err),
    });
  }

  deleteProduct(product: Product) {
    if (!confirm(`Delete "${product.title}"?`)) return;
    this.productsService.deleteProduct(product._id).subscribe({
      error: err => console.error(err),
    });
  }

  retryProducts() {
    this.productsService.isError.set(false);
    this.productsService.refreshProducts();
  }
}
