import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  token = '';
  newPassword = '';
  errorMessage = '';
  successMessage = '';
  apiUrl = 'http://localhost:3000'; // Add this line

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  onSubmit() {
    this.http.post(`${this.apiUrl}/auth/reset-password`, { token: this.token, password: this.newPassword }).subscribe(
      (response: any) => {
        this.successMessage = response.message;
        this.router.navigate(['/login']);
      },
      (error) => {
        this.errorMessage = error.error.message;
      }
    );
  }
}