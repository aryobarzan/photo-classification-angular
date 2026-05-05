import { Component, inject, input } from '@angular/core';
import { UserService } from '../../core/services/user';
import { AuthService } from '../../core/services/auth';
import { UserProfile } from '../../core/schemas/user';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private authService = inject(AuthService);
  userProfile = input.required<UserProfile>();
  readonly isAdmin = this.authService.isAdmin;

  userService = inject(UserService);

  getProfilePictureUrl(): string | null {
    const filename = this.userProfile().profile_picture_filename;
    if (filename) {
      return this.userService.fetchProfilePictureUrl(filename);
    }
    return null;
  }
}
