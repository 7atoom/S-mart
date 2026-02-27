import {Component, inject, OnInit} from '@angular/core';
import {Hero} from './components/hero/hero';
import {Ramadan} from './components/ramadan/ramadan';
import {HowItWorks} from './components/how-it-works/how-it-works';
import {Categories} from './components/categories/categories';
import {AiChefPromo} from './components/ai-chef-promo/ai-chef-promo';
import {PopularThisWeek} from './components/popular-this-week/popular-this-week';
import {Footer} from './components/footer/footer';
import {ProductsService} from '../../core/services/products.service';
import {CategoriesService} from '../../core/services/categories.service';

@Component({
  selector: 'app-home',
  imports: [Hero, Ramadan, HowItWorks, Categories, AiChefPromo, PopularThisWeek, Footer],
  templateUrl: './home.html',
  styles: ``,
})
export class Home implements OnInit {
  private productsService = inject(ProductsService);
  private categoriesService = inject(CategoriesService);

  ngOnInit() {
    this.productsService.getProducts().subscribe();
    this.categoriesService.getCategories().subscribe();
  }
}
