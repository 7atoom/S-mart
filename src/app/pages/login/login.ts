import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../core/services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly auth = inject(Auth)
  private readonly router = inject(Router)
  isLoading = signal(false)
  errormsg :string = ""
  successMsg: string=""

  loginForm :FormGroup= new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]) //, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  })
  onSubmit() {
    if(this.loginForm.valid){
      console.log(this.loginForm.value)
      this.isLoading.set(true)
      this.auth.sendLoginForm(this.loginForm.value).subscribe({
        
        next:(res)=>{
          this.isLoading.set(false)
          console.log(res)
          this.errormsg = ""
          this.successMsg = res.message
          //save token in local storage
          localStorage.setItem('token',res.accessToken)
          //decode token to get user data
          this.auth.getUserData()
          //navigate to home page
          setTimeout(()=>{
            this.router.navigate(['/shop'])
          },2000)
          
        },
        error:(err)=>{
          console.log(err)
          this.errormsg = err.error.error
          this.isLoading.set(false)
        }
    })
    }
    else{
      this.loginForm.markAllAsTouched()
    }
  }
  
}
