import {Component, inject} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-categories',
    imports: [
        NgOptimizedImage,
    ],
  templateUrl: './categories.html',
  styles: ``,
})
export class Categories {
  router = inject(Router);
  navigateToCategory(category: string) {
    this.router.navigate(['/shop'], {
      queryParams: {category: category}
    }).then(() =>
      window.scrollTo(0, 0));
  }
}
