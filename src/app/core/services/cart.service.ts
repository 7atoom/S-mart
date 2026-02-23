import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../../utils/CartItem';
import { Products } from '../../utils/Product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  items = computed(() => this.cartItems());
  itemCount = computed(() => this.cartItems().reduce((sum, item) => sum + item.quantity, 0));
  total = computed(() => this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0));
  deliveryFee = 4.99;

  constructor() {
    this.loadCart();
  }

  addItem(product: Products) {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      this.updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        weight: product.weight,
        image: product.image,
        quantity: 1
      };
      this.cartItems.set([...currentItems, newItem]);
      this.saveCart();
    }
  }

  addItems(items: CartItem[]) {
    const currentItems = this.cartItems();
    const updatedItems = [...currentItems];

    items.forEach(newItem => {
      const existingItem = updatedItems.find(item => item.id === newItem.id);
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        updatedItems.push(newItem);
      }
    });

    this.cartItems.set(updatedItems);
    this.saveCart();
  }

  updateQuantity(productId: string, quantity: number) {
    const currentItems = this.cartItems();

    if (quantity <= 0) {
      this.removeItem(productId);
    } else {
      const updatedItems = currentItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      this.cartItems.set(updatedItems);
      this.saveCart();
    }
  }

  removeItem(productId: string) {
    const currentItems = this.cartItems();
    this.cartItems.set(currentItems.filter(item => item.id !== productId));
    this.saveCart();
  }

  getCartItem(productId: string): CartItem | undefined {
    return this.cartItems().find(item => item.id === productId);
  }

  clearCart() {
    this.cartItems.set([]);
    this.saveCart();
  }

  private saveCart() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('smart-cart', JSON.stringify(this.cartItems()));
    }
  }

  private loadCart() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smart-cart');
      if (saved) {
        try {
          this.cartItems.set(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading cart:', error);
        }
      }
    }
  }
}
