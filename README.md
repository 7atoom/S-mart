<p align="center">
  <img src="public/images/logo.png" alt="S-Mart Logo" width="200"/>
</p>

<h1 align="center">🛒 S-Mart</h1>

<p align="center">
  <strong>A Modern AI-Powered Grocery Shopping Experience</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#api-reference">API Reference</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-21.1.0-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular"/>
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS"/>
  <img src="https://img.shields.io/badge/RxJS-7.8-B7178C?style=for-the-badge&logo=reactivex&logoColor=white" alt="RxJS"/>
</p>

---

## 📋 Overview

**S-Mart** is a full-featured, modern e-commerce grocery application built with Angular 21. It offers a seamless shopping experience with an innovative **AI Chef** feature that generates recipes and automatically adds required ingredients to your cart.

The application features a beautiful, responsive UI with warm color themes, skeleton loading states, real-time cart synchronization, and comprehensive user authentication.

---

## ✨ Features

### 🛍️ Core Shopping Experience
- **Product Catalog** - Browse products by categories with advanced filtering and sorting
- **Real-time Search** - Instantly find products with live search functionality
- **Smart Cart System** - Add, update, and remove items with optimistic UI updates and debounced API calls
- **Guest & Authenticated Shopping** - Shop as a guest with local storage or sync your cart when logged in

### 🤖 AI Chef (Signature Feature)
- **Recipe Generation** - Enter any dish name and get AI-generated recipes with required ingredients
- **Smart Ingredient Matching** - Automatically matches recipe ingredients with available products in the store
- **Bulk Add to Cart** - Add all recipe ingredients to cart with a single click
- **Serving Size Calculation** - Adjust ingredient quantities based on the number of servings

### 👤 User Management
- **Secure Authentication** - JWT-based login and registration with password validation
- **Role-Based Access** - Admin dashboard for product and category management
- **Protected Routes** - Route guards for authenticated, guest, admin, and checkout flows

### 🎨 Modern UI/UX
- **Responsive Design** - Fully responsive layout that works on all devices
- **Skeleton Loading** - Beautiful loading states for better perceived performance
- **Smooth Animations** - Lottie animations and CSS transitions throughout
- **Error Handling** - Graceful error states with retry functionality

### 📦 Additional Features
- **Multi-step Checkout** - Streamlined checkout process with shipping, payment, and confirmation
- **Category Management** - Dynamic categories fetched from the API
- **Product Management** - Admin dashboard for CRUD operations on products
- **Ramadan Special Section** - Seasonal promotions and themed content

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Angular 21** | Core framework with signals and standalone components |
| **TypeScript 5.9** | Type-safe development |
| **TailwindCSS 4** | Utility-first styling |
| **RxJS 7.8** | Reactive programming and state management |
| **Lucide Angular** | Beautiful, consistent icons |
| **Lottie (ngx-lottie)** | Smooth animations |

### Backend Integration
| Technology | Purpose |
|------------|---------|
| **RESTful API** | Backend communication |
| **JWT (jwt-decode)** | Token-based authentication |
| **HttpClient** | API requests with interceptors |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x or **yarn**
- **Angular CLI** >= 21.x

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/s-mart.git
   cd s-mart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   ng serve
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

---

## 📁 Project Structure

```
S-mart/
├── public/                          # Static assets
│   ├── images/                      # Logo, backgrounds
│   └── loader/                      # Lottie animation files
├── src/
│   ├── app/
│   │   ├── core/                    # Core functionality
│   │   │   ├── guards/              # Route guards
│   │   │   │   ├── admin.guard.ts   # Admin access protection
│   │   │   │   ├── auth.guard.ts    # Authenticated routes
│   │   │   │   ├── checkout.guard.ts
│   │   │   │   └── guest.guard.ts   # Guest-only routes
│   │   │   └── services/            # Application services
│   │   │       ├── ai-chef.service.ts
│   │   │       ├── auth.service.ts
│   │   │       ├── cart.service.ts
│   │   │       ├── categories.service.ts
│   │   │       └── products.service.ts
│   │   ├── pages/                   # Page components
│   │   │   ├── ai-chef/             # AI Chef landing
│   │   │   ├── ai-chef-pick/        # Recipe selection
│   │   │   ├── ai-chef-pick-cart/   # Recipe cart view
│   │   │   ├── ai-chef-pick-people/ # Serving size selection
│   │   │   ├── cart/                # Shopping cart
│   │   │   ├── checkout/            # Multi-step checkout
│   │   │   ├── dashboard/           # Admin dashboard
│   │   │   ├── home/                # Homepage with sections
│   │   │   ├── login/               # User login
│   │   │   ├── shop/                # Product listing
│   │   │   ├── signup/              # User registration
│   │   │   └── not-found/           # 404 page
│   │   ├── shared/                  # Shared components & pipes
│   │   │   ├── components/
│   │   │   │   ├── navbar/
│   │   │   │   └── product-card/
│   │   │   └── pipes/
│   │   │       ├── format-card-number.pipe.ts
│   │   │       ├── format-cvv.pipe.ts
│   │   │       ├── format-expiry.pipe.ts
│   │   │       └── search.pipe.ts
│   │   ├── utils/                   # TypeScript interfaces
│   │   │   ├── AiChefRecipe.ts
│   │   │   ├── CartItem.ts
│   │   │   ├── Category.ts
│   │   │   └── Product.ts
│   │   ├── app.routes.ts            # Application routing
│   │   └── app.config.ts            # App configuration
│   ├── index.html
│   ├── main.ts
│   └── styles.css                   # Global styles
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛣️ Routes

| Route | Component | Guard | Description |
|-------|-----------|-------|-------------|
| `/home` | Home | - | Landing page with all sections |
| `/shop` | Shop | - | Product catalog with filters |
| `/cart` | Cart | Auth | Shopping cart |
| `/checkout` | Checkout | Auth + Checkout | Multi-step checkout |
| `/aiChef` | AiChef | - | AI Chef landing page |
| `/aiChef/:recipe` | AiChefPickPeople | - | Serving size selection |
| `/aiChef/:recipe/cart` | AiChefPickCart | - | Recipe ingredients cart |
| `/login` | Login | Guest | User login |
| `/signup` | Signup | Guest | User registration |
| `/dashboard` | Dashboard | Admin | Admin product management |

---

## 🔌 API Reference

### Base URL
```
https://s-mart-api.vercel.app/api
```

### Endpoints

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login |
| POST | `/auth/register` | User registration |

#### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| GET | `/products/:id` | Get product by ID |

#### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | Get all categories |

#### Cart (Requires Authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cart` | Get user's cart |
| POST | `/cart` | Add item to cart |
| PATCH | `/cart/:productId` | Update item quantity |
| DELETE | `/cart/:productId` | Remove item from cart |
| DELETE | `/cart/clear` | Clear entire cart |

#### AI Chef
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai-chef` | Generate recipe for a dish |

---

## 🎯 Key Implementation Highlights

### Signals & Computed Properties
The application leverages Angular's modern **Signals API** for reactive state management:

```typescript
cartItems = signal<CartItem[]>([]);

itemCount = computed(() => {
  const items = this.cartItems();
  return items.reduce((sum, item) => sum + item.quantity, 0);
});
```

### Debounced API Calls
Optimized cart operations with debouncing to prevent excessive API calls:

```typescript
private addDebounceMap = new Map<string, Subject<{ product: Product; snapshot: CartItem[] }>>();
```

### Optimistic UI Updates
Cart updates are applied immediately to the UI, with rollback on API failure for a snappy user experience.

### Standalone Components
All components are standalone, reducing bundle size and improving tree-shaking:

```typescript
@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [NgClass, FormsModule, ProductCard, ...],
})
```

---

## 📱 Screenshots

<p align="center">
  <i>Screenshots coming soon...</i>
</p>

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Ahmed Hatem**

- ITI 9-Month Program
- Full-Stack Angular Project

---

<p align="center">
  Made with ❤️ using Angular
</p>
