import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Shop } from './pages/shop/shop';
import { AiChef } from './pages/ai-chef/ai-chef';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: Home},
    {path: 'shop', component: Shop},
    {path: 'aiChef', component: AiChef},
    {path: '**', component: NotFound},
];
