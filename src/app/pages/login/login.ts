import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly auth = inject(Auth)
  loginForm :FormGroup= new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]) //, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  })
  private readonly router = inject(Router)

  onSubmit() {
    if(this.loginForm.valid){
      console.log(this.loginForm.value)
      this.auth.sendLoginForm(this.loginForm.value).subscribe({
        next:(res)=>{
          console.log(res)
          //save token in local storage
          localStorage.setItem('token',res.access_token)
          //decode token to get user data
          this.auth.getUserData()
          //navigate to home page
          this.router.navigate(['/shop'])
          
        },
        error:(err)=>{
          console.log(err)
        }
    })
    }
    else{
      this.loginForm.markAllAsTouched()
    }
  }
  
}
