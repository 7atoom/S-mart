import {Component, inject, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CategoriesService} from '../../../../core/services/categories.service';


@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.html',
  styles: ``,
})
export class Categories implements OnInit {
  router = inject(Router);
  categoriesService = inject(CategoriesService);

  categories = this.categoriesService.categories;
  isLoading = this.categoriesService.isLoading;
  isError = this.categoriesService.isError;

  ngOnInit() {
    this.categoriesService.getCategories().subscribe({
      error: (err) => console.error('Error fetching categories', err)
    });
  }

  retry() {
    this.categoriesService.isError.set(false);
    this.categoriesService.getCategories().subscribe({
      error: (err) => console.error('Error fetching categories', err)
    });
  }

  navigateToCategory(category: string) {
    this.router.navigate(['/shop'], {
      queryParams: {category: category}
    }).then(() => window.scrollTo(0, 0));
  }
}
