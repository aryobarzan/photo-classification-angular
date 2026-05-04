import { Component } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

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

  onSubmit() {}

  private passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const repeatPassword = control.get('repeatPassword')?.value;
    return password !== repeatPassword ? { passwordsMismatch: true } : null;
  }
}
