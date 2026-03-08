import {computed, inject, Injectable, OnDestroy, signal} from '@angular/core';
import {CartItem} from '../../utils/CartItem';
import {Product} from '../../utils/Product';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnDestroy {
  private readonly baseUrl = 'https://s-mart-api.vercel.app/api/cart';
  private httpClient = inject(HttpClient);

  cartItems = signal<CartItem[]>([]);
  isLoading = signal<boolean>(false);
  isError = signal<boolean>(false);

  private addDebounceMap = new Map<string, Subject<{ product: Product; snapshot: CartItem[] }>>();

  private updateDebounceMap = new Map<string, Subject<{ quantity: number; snapshot: CartItem[] }>>();

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

  ngOnDestroy() {
    this.addDebounceMap.forEach(s => s.complete());
    this.updateDebounceMap.forEach(s => s.complete());
  }

  private isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('token');
    return !!token;
  }

  private authHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      ...(token ? {Authorization: `Bearer ${token}`} : {}),
    };
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

  private matchesProductId(item: CartItem, productId: string): boolean {
    return item.productId === productId || item._id === productId;
  }

  private extractCartItemsFromResponse(res: any): any[] {
    if (Array.isArray(res)) return res;
    return res?.cart ?? res?.items ?? res?.data ?? [];
  }

  private getRecipeGroupMap(): Record<string, string | undefined> {
    const groupMap: Record<string, string | undefined> = {};

    if (typeof window === 'undefined') return groupMap;

    try {
      const saved = localStorage.getItem('smart-cart');
      if (!saved) return groupMap;

      const parsed: CartItem[] = JSON.parse(saved);
      parsed.forEach(item => {
        if (item.recipeGroup) {
          groupMap[item._id] = item.recipeGroup;
          groupMap[item.productId] = item.recipeGroup;
        }
      });
    } catch (error) {
      console.error('Error reading recipe groups:', error);
    }

    return groupMap;
  }

  private transformCartItem(rawItem: any, recipeGroupMap: Record<string, string | undefined>): CartItem {
    if (!rawItem.product) return rawItem;

    const id = rawItem.product._id;
    return {
      _id: id,
      productId: id,
      name: rawItem.product.title || rawItem.product.name,
      title: rawItem.product.title,
      price: rawItem.product.price,
      image: rawItem.product.image,
      weight: rawItem.product.unit || rawItem.product.weight || '',
      quantity: rawItem.quantity,
      category: rawItem.product.category,
      recipeGroup: recipeGroupMap[id],
    };
  }

  private updateQuantityOptimistically(productId: string, quantity: number, previous: CartItem[]): void {
    if (quantity <= 0) {
      this.cartItems.set(previous.filter(i => !this.matchesProductId(i, productId)));
    } else {
      this.cartItems.set(previous.map(i =>
        this.matchesProductId(i, productId) ? {...i, quantity} : i
      ));
    }
    this.saveCart();
  }

  private removeItemFromServer(productId: string, snapshot: CartItem[]): void {
    this.httpClient.delete(
      `${this.baseUrl}/${productId}`,
      {headers: this.authHeaders()}
    ).subscribe({
      next: () => this.getCart(),
      error: (err) => {
        console.error('Failed to remove item:', err);
        this.rollbackToSnapshot(snapshot);
      }
    });
  }

  private updateQuantityOnServer(productId: string, quantity: number, snapshot: CartItem[]): void {
    // Read the *latest* quantity from the signal (captures all intermediate changes)
    const currentItems = this.cartItems();
    const currentItem = currentItems.find(i => this.matchesProductId(i, productId));
    const latestQty = currentItem ? currentItem.quantity : quantity;

    this.httpClient.patch<any>(
      `${this.baseUrl}/${productId}`,
      {quantity: latestQty},
      {headers: this.authHeaders()}
    ).subscribe({
      next: () => this.getCart(),
      error: (err) => {
        console.error('Failed to update item quantity:', err);
        this.rollbackToSnapshot(snapshot);
      }
    });
  }

  private rollbackToSnapshot(snapshot: CartItem[]): void {
    this.cartItems.set(snapshot);
    this.saveCart();
    this.isError.set(true);
  }

  private getOrCreateUpdateDebouncer(productId: string): Subject<{ quantity: number; snapshot: CartItem[] }> {
    if (!this.updateDebounceMap.has(productId)) {
      const subject = new Subject<{ quantity: number; snapshot: CartItem[] }>();

      subject.pipe(debounceTime(600)).subscribe(({quantity, snapshot}) => {
        if (quantity <= 0) {
          this.removeItemFromServer(productId, snapshot);
        } else {
          this.updateQuantityOnServer(productId, quantity, snapshot);
        }
      });

      this.updateDebounceMap.set(productId, subject);
    }

    return this.updateDebounceMap.get(productId)!;
  }

  getCart() {
    // Guest mode: use localStorage only
    if (!this.isAuthenticated()) {
      this.loadCart();
      return;
    }

    this.isLoading.set(true);

    this.httpClient.get<any>(`${this.baseUrl}`, {headers: this.authHeaders()}).subscribe({
      next: (res) => {
        const rawItems = this.extractCartItemsFromResponse(res);
        const recipeGroupMap = this.getRecipeGroupMap();

        const cartItems: CartItem[] = rawItems.map(item =>
          this.transformCartItem(item, recipeGroupMap)
        );

        this.cartItems.set(cartItems);
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
    const productId = product._id;

    // Optimistic UI — instant feedback on every click
    const previous = this.cartItems();
    const existing = previous.find(i => this.matchesProductId(i, productId));

    if (existing) {
      this.cartItems.set(previous.map(i =>
        this.matchesProductId(i, productId)
          ? {...i, quantity: i.quantity + 1}
          : i
      ));
    } else {
      this.cartItems.set([...previous, {
        _id: productId,
        productId,
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

    // Guest mode: only use localStorage, skip API call
    if (!this.isAuthenticated()) {
      return;
    }

    if (!this.addDebounceMap.has(productId)) {
      const subject = new Subject<{ product: Product; snapshot: CartItem[] }>();
      subject.pipe(debounceTime(600)).subscribe(({product: p, snapshot}) => {
        const currentItems = this.cartItems();
        const currentItem = currentItems.find(i => this.matchesProductId(i, p._id));
        const qty = currentItem ? currentItem.quantity : 1;

        this.httpClient.post(
          `${this.baseUrl}`,
          {productId: p._id, quantity: qty},
          {headers: this.authHeaders()}
        ).subscribe({
          next: () => this.getCart(),
          error: (err) => {
            console.error('Failed to add item to cart:', err);
            this.cartItems.set(snapshot);
            this.saveCart();
            this.isError.set(true);
          }
        });
      });
      this.addDebounceMap.set(productId, subject);
    }

    this.addDebounceMap.get(productId)!.next({product, snapshot: previous});
  }

  addItems(items: CartItem[]) {
    if (!items.length) return;
    this.isLoading.set(true);

    const previous = this.cartItems();
    const optimistic = [...previous];

    items.forEach(newItem => {
      const existing = optimistic.find(i => this.matchesProductId(i, newItem._id));
      if (existing) {
        existing.quantity += newItem.quantity;
      } else {
        optimistic.push(newItem);
      }
    });

    this.cartItems.set(optimistic);
    this.saveCart();

    if (!this.isAuthenticated()) {
      this.isLoading.set(false);
      return;
    }

    this.addItemsSequentially(items, 0, previous);
  }

  private addItemsSequentially(items: CartItem[], index: number, rollbackSnapshot: CartItem[]) {
    if (index >= items.length) {
      this.getCart();
      this.isLoading.set(false);
      return;
    }

    const item = items[index];
    const payload = {productId: item._id, quantity: item.quantity};

    this.httpClient.post(`${this.baseUrl}`, payload, {headers: this.authHeaders()}).subscribe({
      next: () => {
        this.addItemsSequentially(items, index + 1, rollbackSnapshot);
      },
      error: (err) => {
        console.error('Failed to add item to cart (bulk):', err);
        this.cartItems.set(rollbackSnapshot);
        this.saveCart();
        this.isError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  updateQuantity(productId: string, quantity: number) {
    const previous = this.cartItems();

    // Step 1: Optimistic UI update (instant feedback)
    this.updateQuantityOptimistically(productId, quantity, previous);

    // Step 2: Guest mode - skip server sync
    if (!this.isAuthenticated()) {
      return;
    }

    // Step 3: Debounced server sync (waits 600ms after last change)
    const debouncer = this.getOrCreateUpdateDebouncer(productId);
    debouncer.next({quantity, snapshot: previous});
  }

  removeItem(productId: string) {
    const previous = this.cartItems();
    this.cartItems.set(previous.filter(i => !this.matchesProductId(i, productId)));
    this.saveCart();

    // Guest mode: only use localStorage, skip API call
    if (!this.isAuthenticated()) {
      return;
    }

    this.removeItemFromServer(productId, previous);
  }

  getCartItem(productId: string): CartItem | undefined {
    const items = this.cartItems();
    if (!Array.isArray(items)) return undefined;
    return items.find(item => this.matchesProductId(item, productId));
  }

  clearCart() {
    this.cartItems.set([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('smart-cart');
    }

    // Guest mode: only use localStorage, skip API call
    if (!this.isAuthenticated()) {
      return;
    }

    this.isLoading.set(true);
    this.httpClient.delete(`${this.baseUrl}/clear`, {headers: this.authHeaders()}).subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to clear cart on server:', err);
        this.isError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  clearLocalCart() {
    this.cartItems.set([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('smart-cart');
    }
  }

  syncCartAfterLogin() {
    if (!this.isAuthenticated()) return;

    const localItems = this.cartItems();

    // If there are local items, sync them to server
    if (localItems.length > 0) {
      this.addItemsSequentially(localItems, 0, []);
    } else {
      // No local items, just fetch the server cart
      this.getCart();
    }
  }
}
