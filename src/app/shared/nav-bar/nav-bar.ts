import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
