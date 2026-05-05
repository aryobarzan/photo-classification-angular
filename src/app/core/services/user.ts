import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { UserProfile } from '../schemas/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  userProfile = signal<UserProfile | null>(null);
  fetchingProfile = signal(false);
  fetchError = signal<string | null>(null);

  constructor() {
    this.fetchUserProfile();
  }

  fetchUserProfile() {
    this.fetchingProfile.set(true);
    this.http.get<UserProfile>(`${environment.apiUrl}users/profile`).subscribe({
      next: (profile) => {
        this.userProfile.set(profile);
        this.fetchingProfile.set(false);
      },
      error: (err) => {
        this.fetchError.set(`Failed to fetch user profile: ${err.message}`);
        this.fetchingProfile.set(false);
      },
    });
  }

  async updateUserProfile(
    profileData: UserProfile,
    profilePicture: File | null,
  ): Promise<string | null> {
    this.fetchingProfile.set(true);
    const formData = new FormData();
    formData.append('profile_data', JSON.stringify(profileData));
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }
    try {
      // convert the Observable to a Promise using firstValueFrom
      const updatedProfile = await firstValueFrom(
        this.http.put<UserProfile>(`${environment.apiUrl}users/profile`, formData),
      );
      this.userProfile.set(updatedProfile);
      return null;
    } catch (err: any) {
      const msg = `Failed to update user profile: ${err.message}`;
      this.fetchError.set(msg);
      return msg;
    } finally {
      this.fetchingProfile.set(false);
    }
  }

  fetchProfilePictureUrl(filename: string): string {
    return `${environment.apiUrl}users/profile/picture/${filename}`;
  }
}
