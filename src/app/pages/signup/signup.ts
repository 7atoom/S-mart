import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  private readonly router = inject(Router)
  private readonly auth = inject(Auth)
  isLoading = signal(false)
  errormsg :string = ""
  successMsg: string=""
  registerForm: FormGroup = new FormGroup({
    firstName: new FormControl(null,[Validators.required,Validators.minLength(3),Validators.maxLength(20)]),
    lastName: new FormControl(null,[Validators.required,Validators.minLength(3),Validators.maxLength(20)]),
    email: new FormControl(null,[Validators.required, Validators.email]),
    password: new FormControl(null,[Validators.required]) //, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  })

  onSubmit(){
    console.log(this.registerForm)
    if(this.registerForm.valid){
      this.isLoading.set(true)
      console.log(this.registerForm.value)
      this.auth.sendSignupForm(this.registerForm.value).subscribe({
        next:(res) => {
          console.log(res)
          //save token in local storage
          localStorage.setItem('token',res.accessToken)
          //decode token to get user data
          this.auth.getUserData()
          this.isLoading.set(false)
          this.errormsg = ""
          this.successMsg = res.message
          //navigate to home page
          setTimeout(() => {
            this.router.navigate(['/shop'])
          },2000)
          
        },
        error:(err)=>{
          console.log(err)
          this.errormsg = err.error.error
          console.log(this.errormsg)
          this.isLoading.set(false)
        }
      })
    }
    else{
      this.registerForm.markAllAsTouched()
    }
  }
}
