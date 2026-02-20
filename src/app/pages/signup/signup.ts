import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  private readonly router = inject(Router)
  registerForm: FormGroup = new FormGroup({
    firstName: new FormControl(null,[Validators.required,Validators.minLength(3),Validators.maxLength(20)]),
    lastName: new FormControl(null,[Validators.required,Validators.minLength(3),Validators.maxLength(20)]),
    email: new FormControl(null,[Validators.required, Validators.email]),
    password: new FormControl(null,[Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)])
  })

  onSubmit(){
    console.log(this.registerForm)
    if(this.registerForm.valid){
      console.log(this.registerForm.value)
      this.router.navigate(['/login'])
    }
    else{
      this.registerForm.markAllAsTouched()
    }

  }
}
