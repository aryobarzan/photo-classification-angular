import { Component, inject } from '@angular/core';
import { UserService } from '../../core/services/user';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private userService = inject(UserService);
}
