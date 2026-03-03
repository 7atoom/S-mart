import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Auth } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

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
  private readonly cartService = inject(CartService)
  isLoading = signal(false)
  showPassword = signal(false)
  errors :string = ""
  successMsg: string=""

  loginForm :FormGroup= new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20),
      this.uppercaseValidator,
      this.lowercaseValidator,
      this.numberValidator
    ])
  })

  // Custom validators
  uppercaseValidator(control: AbstractControl): ValidationErrors | null {
    return /[A-Z]/.test(control.value) ? null : { uppercase: true };
  }

  lowercaseValidator(control: AbstractControl): ValidationErrors | null {
    return /[a-z]/.test(control.value) ? null : { lowercase: true };
  }

  numberValidator(control: AbstractControl): ValidationErrors | null {
    return /[0-9]/.test(control.value) ? null : { number: true };
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }
  onSubmit() {
    if(this.loginForm.valid){
      console.log(this.loginForm.value)
      this.isLoading.set(true)
      this.auth.sendLoginForm(this.loginForm.value).subscribe({

        next:(res)=>{
          this.isLoading.set(false)
          console.log(res)
          this.errors = ""
          this.successMsg = res.message
          //save token in local storage
          localStorage.setItem('token',res.accessToken)
          localStorage.setItem('role',res.data.role)
          console.log(res.data.role)
          //decode token to get user data
          this.auth.getUserData()
          // Sync guest cart to server after login
          this.cartService.syncCartAfterLogin()
          //navigate to home page
          setTimeout(()=>{
            this.router.navigate(['/shop'])
          },2000)

        },
        error:(err)=>{
          console.log(err)
          this.errors = err.error.error
          this.isLoading.set(false)
        }
    })
    }
    else{
      this.loginForm.markAllAsTouched()
    }
  }

}
