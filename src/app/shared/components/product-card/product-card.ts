import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { Product } from '../../../utils/Product';
import { CartItem } from '../../../utils/CartItem';


@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, NgStyle],
  templateUrl: './product-card.html',
  styles: ``,
})
export class ProductCard {
  @Input() product!: Product;
  @Input() cartItem?: CartItem;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() updateQuantity = new EventEmitter<{ productId: string; quantity: number }>();

  isHovered = false;

  onAddToCart(event: Event) {
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }

  onUpdateQuantity(event: Event, quantity: number) {
    event.stopPropagation();
    this.updateQuantity.emit({ productId: this.product._id, quantity });
  }

  onProductClick() {
    console.log('Product clicked:', this.product);
  }
}

