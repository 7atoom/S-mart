import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Shop } from './pages/shop/shop';
import { AiChef } from './pages/ai-chef/ai-chef';
import { NotFound } from './pages/not-found/not-found';
import { Cart } from './pages/cart/cart';
import { AiChefPick } from './pages/ai-chef-pick/ai-chef-pick';
import { AiChefPickPeople } from './pages/ai-chef-pick-people/ai-chef-pick-people';
import { AiChefPickCart } from './pages/ai-chef-pick-cart/ai-chef-pick-cart';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { CheckoutComponent } from './pages/checkout/checkout';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'signup', component: Signup, canActivate: [guestGuard] },
  { path: 'shop', component: Shop },
  { path: 'aiChef', component: AiChef },
  { path: 'aiChef/:meal', component: AiChefPick },
  { path: 'aiChef/:meal/:selectedRecipe', component: AiChefPickPeople },
  { path: 'aiChef/:meal/:selectedRecipe/cart', component: AiChefPickCart },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'cart', component: Cart, canActivate: [authGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: '**', component: NotFound },
];
