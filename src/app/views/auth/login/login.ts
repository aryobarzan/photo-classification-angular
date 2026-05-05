import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ToastService } from '../../../core/services/toast';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(32),
      Validators.pattern(/^[a-zA-Z0-9_-]+$/),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(64),
    ]),
  });

  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);

  async onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      try {
        const success = await this.authService.login(username!, password!);
        if (success) {
          this.toastService.show('Login successful!', 'success');
          this.router.navigate(['']);
        } else {
          this.toastService.show('Invalid username or password.', 'error');
        }
      } catch (error) {
        this.toastService.show(`An error occurred during login.`, 'error');
      }
    }
  }
}
