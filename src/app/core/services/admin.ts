import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { UserProfile } from '../schemas/user';
import { environment } from '../../../environments/environment.development';

enum UserGender {
  male = 'male',
  female = 'female',
  other = 'other',
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);

  userProfiles = signal<UserProfile[] | null>(null);
  fetchingProfiles = signal(false);
  fetchError = signal<string | null>(null);
  selectedProfile = signal<UserProfile | null>(null);

  // Potential query parameters for filtering:
  minAge: number | null = null;
  maxAge: number | null = null;
  exactAge: number | null = null;
  genders: UserGender[] | null = null;
  placeOfResidence: string | null = null;
  countryOfOrigin: string | null = null;

  constructor() {
    this.fetchUserProfiles();
  }

  fetchUserProfiles() {
    this.fetchingProfiles.set(true);
    let params = new HttpParams();
    // If exactAge is set, it takes precedence over minAge and maxAge
    if (this.exactAge !== null) params = params.set('exact_age', this.exactAge);
    else {
      if (this.minAge !== null) params = params.set('min_age', this.minAge);
      if (this.maxAge !== null) params = params.set('max_age', this.maxAge);
    }
    if (this.genders?.length) params = params.set('genders', this.genders.join(','));
    if (this.placeOfResidence) params = params.set('place_of_residence', this.placeOfResidence);
    if (this.countryOfOrigin) params = params.set('country_of_origin', this.countryOfOrigin);
    this.http
      .get<UserProfile[]>(`${environment.apiUrl}admin/users/profiles`, { params })
      .subscribe({
        next: (profiles) => {
          this.userProfiles.set(profiles);
          this.fetchingProfiles.set(false);
        },
        error: (err) => {
          console.error('Error fetching user profiles:', err);
          this.fetchError.set(`Failed to fetch user profiles: ${err.message}`);
          this.fetchingProfiles.set(false);
        },
      });
  }
}
