import {computed, inject, Injectable, signal} from '@angular/core';
import {CartItem} from '../../utils/CartItem';
import {Product} from '../../utils/Product';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly baseUrl = 'https://s-mart-api.vercel.app/api/cart';
  private httpClient = inject(HttpClient);

  cartItems = signal<CartItem[]>([]);
  isLoading = signal<boolean>(false);
  isError = signal<boolean>(false);


  items = computed(() => {
    const items = this.cartItems();
    return Array.isArray(items) ? items : [];
  });
  itemCount = computed(() => {
    const items = this.cartItems();
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + item.quantity, 0);
  });
  total = computed(() => {
    const items = this.cartItems();
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  });
  deliveryFee = 4.99;

  constructor() {
    this.loadCart();
  }

  getCart() {
    const token = localStorage.getItem('token');
    if (!token) return;
    const headers = {Authorization: `Bearer ${token}`};

    this.isLoading.set(true);
    this.httpClient.get<any>(`${this.baseUrl}`, {headers}).subscribe({
      next: (res) => {
        console.log('Cart API response:', res);
        const rawItems= Array.isArray(res) ? res : (res?.cart ?? res?.items ?? res?.data ?? []);
        const flattenedItems: CartItem[] = (Array.isArray(rawItems) ? rawItems : []).map((item: any) => {
          if (item.product) {
            return {
              _id: item.product._id,
              productId: item.product._id,
              name: item.product.title || item.product.name,
              title: item.product.title,
              price: item.product.price,
              image: item.product.image,
              weight: item.product.unit || item.product.weight || '',
              quantity: item.quantity,
              category: item.product.category
            };
          }
          return item;
        });

        this.cartItems.set(flattenedItems);
        this.saveCart();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load cart:', err);
        this.isError.set(true);
        this.isLoading.set(false);
      }
    });
  }


  addItem(product: Product) {
    const payload = { productId: product._id, quantity: 1 };
    const token = localStorage.getItem('token');
    const headers = {Authorization: `Bearer ${token}`};

    const previous = this.cartItems();
    const existing = previous.find(i => i.productId === product._id || i._id === product._id);
    if (existing) {
      this.cartItems.set(previous.map(i =>
        (i.productId === product._id || i._id === product._id)
          ? {...i, quantity: i.quantity + 1}
          : i
      ));
    } else {
      this.cartItems.set([...previous, {
        _id: product._id,
        productId: product._id,
        name: product.title || (product as any).name,
        title: product.title,
        price: product.price,
        image: product.image,
        weight: (product as any).unit || (product as any).weight || '',
        quantity: 1,
        category: product.category
      }]);
    }
    this.saveCart();

    this.httpClient.post(`${this.baseUrl}`, payload, {headers}).subscribe({
      next: () => {
        this.getCart();
      },
      error: (err) => {
        console.error('Failed to add item to cart:', err);
        this.cartItems.set(previous);
        this.saveCart();
        this.isError.set(true);
      }
    });
  }

  addItems(items: CartItem[]) {
    const payload = items.map(item => ({
      productId: item._id,
      quantity: item.quantity
    }));

    const token = localStorage.getItem('token');
    const headers = {Authorization: `Bearer ${token}`};

    this.isLoading.set(true);
    this.httpClient.post<CartItem[]>(`${this.baseUrl}/bulk`, payload, {headers}).subscribe({
      next: (newItems) => {
        const currentItems = this.cartItems();
        const updatedItems = [...currentItems];

        newItems.forEach(newItem => {
          const existing = updatedItems.find(item => item._id === newItem._id);
          if (existing) {
            existing.quantity += newItem.quantity;
          } else {
            updatedItems.push(newItem);
          }
        });

        this.cartItems.set(updatedItems);
        this.saveCart();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to add items to cart:', err);
        this.isError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  updateQuantity(productId: string, quantity: number) {
    const token = localStorage.getItem('token');
    const headers = {Authorization: `Bearer ${token}`};

    const previous = this.cartItems();
    if (quantity <= 0) {
      this.cartItems.set(previous.filter(i => i.productId !== productId && i._id !== productId));
      this.saveCart();
      this.httpClient.delete(`${this.baseUrl}/${productId}`, {headers}).subscribe({
        next: () => this.getCart(),
        error: (err) => {
          console.error('Failed to remove item:', err);
          this.cartItems.set(previous);
          this.saveCart();
          this.isError.set(true);
        }
      });
      return;
    }

    this.cartItems.set(previous.map(i =>
      (i.productId === productId || i._id === productId)
        ? {...i, quantity}
        : i
    ));
    this.saveCart();

    this.httpClient.patch<any>(`${this.baseUrl}/${productId}`, {quantity}, {headers}).subscribe({
      next: () => this.getCart(), // Sync silently
      error: (err) => {
        console.error('Failed to update item quantity:', err);
        this.cartItems.set(previous); // Roll back
        this.saveCart();
        this.isError.set(true);
      }
    });
  }

  removeItem(productId: string) {
    const token = localStorage.getItem('token');
    const headers = {Authorization: `Bearer ${token}`};

    // Optimistic update: remove instantly
    const previous = this.cartItems();
    this.cartItems.set(previous.filter(i => i.productId !== productId && i._id !== productId));
    this.saveCart();

    this.httpClient.delete(`${this.baseUrl}/${productId}`, {headers}).subscribe({
      next: () => this.getCart(),
      error: (err) => {
        console.error('Failed to remove item from cart:', err);
        this.cartItems.set(previous);
        this.saveCart();
        this.isError.set(true);
      }
    });
  }

  getCartItem(productId: string): CartItem | undefined {
    const items = this.cartItems();
    if (!Array.isArray(items)) return undefined;
    return items.find(item => item.productId === productId || item._id === productId);
  }

  clearCart() {
    const token = localStorage.getItem('token');
    const headers = {Authorization: `Bearer ${token}`};

    this.isLoading.set(true);
    this.httpClient.delete(`${this.baseUrl}/clear`, {headers}).subscribe({
      next: () => {
        this.cartItems.set([]);
        this.saveCart();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to clear cart:', err);
        this.isError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  private saveCart() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('smart-cart', JSON.stringify(this.cartItems()));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    }
  }

  private loadCart() {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('smart-cart');
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          this.cartItems.set(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        this.cartItems.set([]);
      }
    }
  }
}
