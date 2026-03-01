import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../utils/Product';
import { Category } from '../../../../utils/Category';
import { CategoriesService } from '../../../../core/services/categories.service';
import { AddProductBody } from '../../../../core/services/products.service';

const URL_PATTERN = /^https?:\/\/.+/i;

@Component({
  selector: 'app-product-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form-modal.html',
  styles: ``,
})
export class ProductFormModal implements OnChanges {
  @Input() product: Product | null = null;
  @Output() submitForm = new EventEmitter<AddProductBody>();
  @Output() close = new EventEmitter<void>();

  categoriesService = inject(CategoriesService);
  categories = this.categoriesService.categories;

  form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    unit: new FormControl<string>('', []),
    category: new FormControl<string>('', [Validators.required]),
    featured: new FormControl<boolean>(false, []),
    image: new FormControl<string>('', [
      Validators.pattern(URL_PATTERN),
    ]),
    description: new FormControl<string>('', []),
  });

  get isEdit(): boolean {
    return this.product != null;
  }

  get modalTitle(): string {
    return this.isEdit ? 'Edit Product' : 'New Product';
  }

  get submitLabel(): string {
    return this.isEdit ? 'Update Product' : 'Add Product';
  }

  ngOnChanges() {
    if (this.product) {
      const cat = this.product.category as Category;
      this.form.patchValue({
        title: this.product.title,
        price: this.product.price,
        unit: this.product.unit ?? '',
        category: cat?._id ?? '',
        featured: this.product.featured ?? false,
        image: this.product.image ?? '',
        description: this.product.description ?? '',
      });
    } else {
      this.form.reset({
        title: '',
        price: null,
        unit: '',
        category: '',
        featured: false,
        image: '',
        description: '',
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const body: AddProductBody = {
      title: v.title!,
      price: Number(v.price) ?? 0,
      category: v.category!,
      unit: v.unit || undefined,
      featured: v.featured ?? false,
      image: v.image && v.image.trim() ? v.image.trim() : undefined,
      description: v.description && v.description.trim() ? v.description.trim() : undefined,
    };
    this.submitForm.emit(body);
  }

  onCancel() {
    this.close.emit();
  }
}
