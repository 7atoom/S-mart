import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
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
  showPassword = signal(false)
  errors :string = ""
  successMsg: string=""
  registerForm: FormGroup = new FormGroup({
    firstName: new FormControl(null,[Validators.required,Validators.minLength(3),Validators.maxLength(20)]),
    lastName: new FormControl(null,[Validators.required,Validators.minLength(3),Validators.maxLength(20)]),
    email: new FormControl(null,[Validators.required, Validators.email]),
    password: new FormControl(null,[
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
          localStorage.setItem('role',res.data.role)
          console.log(res.data.role)
          //decode token to get user data
          this.auth.getUserData()
          this.isLoading.set(false)
          this.errors = ""
          this.successMsg = res.message
          //navigate to home page
          setTimeout(() => {
            this.router.navigate(['/shop'])
          },2000)

        },
        error:(err)=>{
          console.log(err)
          this.errors = err.error.error
          console.log(this.errors)
          this.isLoading.set(false)
        }
      })
    }
    else{
      this.registerForm.markAllAsTouched()
    }
  }
}
