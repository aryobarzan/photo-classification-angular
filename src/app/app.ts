import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/toast/toast';
import { NavBar } from './shared/nav-bar/nav-bar';
import { AuthService } from './core/services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, NavBar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  authService = inject(AuthService);
  router = inject(Router);
  protected readonly title = signal('photo-classification-angular');

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
