import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  agreeTerms = false;

  onSubmit() {
    // TODO: implement signup
  }
}
