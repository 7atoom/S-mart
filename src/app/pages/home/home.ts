import {Component} from '@angular/core';
import {Hero} from './components/hero/hero';
import {Ramadan} from './components/ramadan/ramadan';
import {HowItWorks} from './components/how-it-works/how-it-works';
import {Categories} from './components/categories/categories';
import {AiChefPromo} from './components/ai-chef-promo/ai-chef-promo';
import {PopularThisWeek} from './components/popular-this-week/popular-this-week';
import {Footer} from './components/footer/footer';

@Component({
  selector: 'app-home',
  imports: [Hero, Ramadan, HowItWorks, Categories, AiChefPromo, PopularThisWeek, Footer],
  templateUrl: './home.html',
  styles: ``,
})
export class Home {

}
