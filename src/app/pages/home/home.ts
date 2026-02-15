import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styles: ``,
})
export class Home {
  router = inject(Router);
  navigateToCategory(category: string) {
    this.router.navigate(['/shop'], { 
      queryParams: {category: category}
    });
  }
}
