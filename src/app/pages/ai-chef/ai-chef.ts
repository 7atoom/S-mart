import { Component,  } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ai-chef',
  imports: [ReactiveFormsModule],
  templateUrl: './ai-chef.html',
  styleUrl: `./ai-chef.css`,
})
export class AiChef {
  constructor(private router: Router) {}

  searchControl = new FormControl("",[Validators.required,Validators.minLength(3)]);
  suggestedMeals: string[] = ['steak','Biryani','Sushi','Pasta','Soup','Salad','Dessert'];
  cook(){
    console.log(this.searchControl.value);
    if(this.searchControl.valid){
      this.router.navigate(['aiChef',this.searchControl.value]);
    }
  }
  setsearchControl(value:string){
    this.searchControl.setValue(value);
    this.cook();
  }
}
