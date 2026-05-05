import { Component, inject, input } from '@angular/core';
import { UserService } from '../../core/services/user';
import { AuthService } from '../../core/services/auth';
import { UserProfile } from '../../core/schemas/user';
import { ProfilePicture } from '../../shared/profile-picture/profile-picture';
import { COUNTRIES } from '../../core/data/countries';

@Component({
  selector: 'app-profile',
  imports: [ProfilePicture],
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

  countryName(code: string): string {
    return COUNTRIES.find((c) => c.code === code)?.name ?? code;
  }
}
