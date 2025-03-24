import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email = '';
  errorMessage = '';
  successMessage = '';
  apiUrl = 'http://localhost:3000'; // Ensure this is public or protected

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http.post(`${this.apiUrl}/auth/forgot-password`, { email: this.email }).subscribe(
      (response: any) => {
        this.successMessage = response.message;
      },
      (error) => {
        this.errorMessage = error.error.message;
      }
    );
  }

  // Add this method to validate the email
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }
}