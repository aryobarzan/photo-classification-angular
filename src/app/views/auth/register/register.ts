import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ToastService } from '../../../core/services/toast';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm = new FormGroup(
    {
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
      repeatPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
      ]),
    },
    { validators: [this.passwordsMatchValidator] },
  );

  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);

  private passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const repeatPassword = control.get('repeatPassword')?.value;
    return password !== repeatPassword ? { passwordsMismatch: true } : null;
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      const { username, password } = this.registerForm.value;
      try {
        const success = await this.authService.register(username!, password!);
        if (success) {
          this.toastService.show('Registration successful!', 'success');
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
