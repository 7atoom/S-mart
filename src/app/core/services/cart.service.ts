import { computed, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { CartItem } from '../../utils/CartItem';
import { Product } from '../../utils/Product';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnDestroy {
  private readonly baseUrl = 'https://s-mart-api.vercel.app/api/cart';
  private httpClient = inject(HttpClient);

  cartItems = signal<CartItem[]>([]);
  isLoading = signal<boolean>(false);
  isError = signal<boolean>(false);

  /** One debounce Subject per productId — for addItem */
  private addDebounceMap = new Map<string, Subject<{ product: Product; snapshot: CartItem[] }>>();

  /** One debounce Subject per productId — for updateQuantity */
  private updateDebounceMap = new Map<string, Subject<{ quantity: number; snapshot: CartItem[] }>>();

  // ── Computed ────────────────────────────────────────────────────────────────

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

  // ── Lifecycle ───────────────────────────────────────────────────────────────

  constructor() {
    this.loadCart();
  }

  ngOnDestroy() {
    this.addDebounceMap.forEach(s => s.complete());
    this.updateDebounceMap.forEach(s => s.complete());
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  private authHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

  // ── API ─────────────────────────────────────────────────────────────────────

  getCart() {
    this.isLoading.set(true);
    this.httpClient.get<any>(`${this.baseUrl}`, { headers: this.authHeaders() }).subscribe({
      next: (res) => {
        const rawItems = Array.isArray(res) ? res : (res?.cart ?? res?.items ?? res?.data ?? []);

        // Restore recipeGroup from localStorage so groups survive server sync
        let localGroupMap: Record<string, string | undefined> = {};
        try {
          const saved = localStorage.getItem('smart-cart');
          if (saved) {
            const parsed: CartItem[] = JSON.parse(saved);
            parsed.forEach(item => {
              if (item.recipeGroup) {
                localGroupMap[item._id] = item.recipeGroup;
                localGroupMap[item.productId] = item.recipeGroup;
              }
            });
          }
        } catch { }

        const flattenedItems: CartItem[] = (Array.isArray(rawItems) ? rawItems : []).map((item: any) => {
          if (item.product) {
            const id = item.product._id;
            return {
              _id: id,
              productId: id,
              name: item.product.title || item.product.name,
              title: item.product.title,
              price: item.product.price,
              image: item.product.image,
              weight: item.product.unit || item.product.weight || '',
              quantity: item.quantity,
              category: item.product.category,
              recipeGroup: localGroupMap[id],
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

  /**
   * Add one unit of a product.
   * • UI updates INSTANTLY on every click (optimistic).
   * • HTTP POST is debounced — fires once after 600 ms of inactivity,
   *   sending the accumulated quantity so rapid clicks don't spam the server.
   */
  addItem(product: Product) {
    const productId = product._id;

    // Optimistic UI — instant feedback on every click
    const previous = this.cartItems();
    const existing = previous.find(i => i.productId === productId || i._id === productId);
    if (existing) {
      this.cartItems.set(previous.map(i =>
        (i.productId === productId || i._id === productId)
          ? { ...i, quantity: i.quantity + 1 }
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

    // Debounced HTTP POST — one request per product after 600 ms of silence
    if (!this.addDebounceMap.has(productId)) {
      const subject = new Subject<{ product: Product; snapshot: CartItem[] }>();
      subject.pipe(debounceTime(600)).subscribe(({ product: p, snapshot }) => {
        // Read the *current* quantity at debounce-fire time (includes all rapid clicks)
        const currentItems = this.cartItems();
        const currentItem = currentItems.find(i => i.productId === p._id || i._id === p._id);
        const qty = currentItem ? currentItem.quantity : 1;

        this.httpClient.post(
          `${this.baseUrl}`,
          { productId: p._id, quantity: qty },
          { headers: this.authHeaders() }
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

    // Pass pre-click snapshot for rollback if the eventual request fails
    this.addDebounceMap.get(productId)!.next({ product, snapshot: previous });
  }

  addItems(items: CartItem[]) {
    if (!items.length) return;
    this.isLoading.set(true);

    const previous = this.cartItems();
    const optimistic = [...previous];
    items.forEach(newItem => {
      const existing = optimistic.find(i => i._id === newItem._id || i.productId === newItem._id);
      if (existing) {
        existing.quantity += newItem.quantity;
      } else {
        optimistic.push(newItem);
      }
    });
    this.cartItems.set(optimistic);
    this.saveCart();

    let remaining = items.length;
    let hasFailed = false;

    items.forEach(item => {
      const payload = { productId: item._id, quantity: item.quantity };
      this.httpClient.post(`${this.baseUrl}`, payload, { headers: this.authHeaders() }).subscribe({
        next: () => {
          remaining--;
          if (remaining === 0) {
            this.getCart();
            this.isLoading.set(false);
          }
        },
        error: (err) => {
          console.error('Failed to add item to cart (bulk):', err);
          if (!hasFailed) {
            hasFailed = true;
            this.cartItems.set(previous);
            this.saveCart();
            this.isError.set(true);
            this.isLoading.set(false);
          }
        }
      });
    });
  }

  /**
   * Set the quantity of a cart item.
   * • UI updates INSTANTLY on every change (optimistic).
   * • HTTP PATCH/DELETE is debounced — fires once after 600 ms of inactivity,
   *   always sending the latest quantity so rapid +/- taps collapse into one call.
   */
  updateQuantity(productId: string, quantity: number) {
    const previous = this.cartItems();

    // Optimistic UI — instant on every call
    if (quantity <= 0) {
      this.cartItems.set(previous.filter(i => i.productId !== productId && i._id !== productId));
    } else {
      this.cartItems.set(previous.map(i =>
        (i.productId === productId || i._id === productId)
          ? { ...i, quantity }
          : i
      ));
    }
    this.saveCart();

    // Debounced HTTP call — one request per product after 600 ms of silence
    if (!this.updateDebounceMap.has(productId)) {
      const subject = new Subject<{ quantity: number; snapshot: CartItem[] }>();
      subject.pipe(debounceTime(600)).subscribe(({ quantity: qty, snapshot }) => {
        if (qty <= 0) {
          // Item should be removed
          this.httpClient.delete(
            `${this.baseUrl}/${productId}`,
            { headers: this.authHeaders() }
          ).subscribe({
            next: () => this.getCart(),
            error: (err) => {
              console.error('Failed to remove item:', err);
              this.cartItems.set(snapshot);
              this.saveCart();
              this.isError.set(true);
            }
          });
        } else {
          // Read the *latest* quantity from the signal (captures all intermediate changes)
          const currentItems = this.cartItems();
          const currentItem = currentItems.find(i => i.productId === productId || i._id === productId);
          const latestQty = currentItem ? currentItem.quantity : qty;

          this.httpClient.patch<any>(
            `${this.baseUrl}/${productId}`,
            { quantity: latestQty },
            { headers: this.authHeaders() }
          ).subscribe({
            next: () => this.getCart(),
            error: (err) => {
              console.error('Failed to update item quantity:', err);
              this.cartItems.set(snapshot);
              this.saveCart();
              this.isError.set(true);
            }
          });
        }
      });
      this.updateDebounceMap.set(productId, subject);
    }

    this.updateDebounceMap.get(productId)!.next({ quantity, snapshot: previous });
  }

  removeItem(productId: string) {
    const previous = this.cartItems();
    this.cartItems.set(previous.filter(i => i.productId !== productId && i._id !== productId));
    this.saveCart();

    this.httpClient.delete(`${this.baseUrl}/${productId}`, { headers: this.authHeaders() }).subscribe({
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
    this.cartItems.set([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('smart-cart');
    }

    this.isLoading.set(true);
    this.httpClient.delete(`${this.baseUrl}/clear`, { headers: this.authHeaders() }).subscribe({
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
}
