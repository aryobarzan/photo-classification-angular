import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { UserService } from '../../core/services/user';
import { RouterLink } from '@angular/router';
import { Profile } from '../profile/profile';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Profile],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  authService = inject(AuthService);
  userService = inject(UserService);
}
