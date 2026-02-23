import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { SparkleIcon, LucideAngularModule } from 'lucide-angular/src/icons';
import { Auth } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, LucideAngularModule],
  templateUrl: './navbar.html',
  styles: ``,
})
export class Navbar {
  isMobileMenuOpen = false;
  cartService = inject(CartService);
  authService = inject(Auth);
  private router = inject(Router);

  cartItemsCount = this.cartService.itemCount;

  readonly SparkleIcon = SparkleIcon;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
