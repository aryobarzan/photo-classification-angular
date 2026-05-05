import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../core/services/admin';
import { UserProfile } from '../../core/schemas/user';
import { COUNTRIES } from '../../core/data/countries';
import {
  MultiselectDropdown,
  DropdownOption,
} from '../../shared/multiselect-dropdown/multiselect-dropdown';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

type SortKey = keyof Pick<
  UserProfile,
  'first_name' | 'last_name' | 'age' | 'gender' | 'country_of_origin' | 'place_of_residence'
>;

@Component({
  selector: 'app-admin-dashboard',
  imports: [MultiselectDropdown, ReactiveFormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  adminService = inject(AdminService);
  router = inject(Router);
  readonly Math = Math;

  // Number of profiles to show per page
  readonly pageSize = 10;
  page = signal(0);
  // Sort by a specific UserProfile field
  sortKey = signal<SortKey>('last_name');
  sortAscending = signal(true);

  // User profiles sorted according to `sortKey` and `sortAscending`
  sorted = computed(() => {
    const profiles = this.adminService.userProfiles() ?? [];
    const key = this.sortKey();
    const asc = this.sortAscending() ? 1 : -1;
    return [...profiles].sort((a, b) => {
      const av = a[key] ?? '';
      const bv = b[key] ?? '';
      return av < bv ? -asc : av > bv ? asc : 0;
    });
  });
  // The profiles to show on the current page after sorting
  paged = computed(() => {
    const start = this.page() * this.pageSize;
    return this.sorted().slice(start, start + this.pageSize);
  });

  totalPages = computed(() =>
    Math.max(1, Math.ceil((this.adminService.userProfiles()?.length ?? 0) / this.pageSize)),
  );
  // Toggle sorting by a specific key, and reset to the first page
  sortBy(key: SortKey) {
    if (this.sortKey() === key) {
      this.sortAscending.update((v) => !v);
    } else {
      this.sortKey.set(key);
      this.sortAscending.set(true);
    }
    this.page.set(0);
  }

  gotoPreviousPage() {
    if (this.page() > 0) this.page.update((p) => p - 1);
  }
  gotoNextPage() {
    if (this.page() < this.totalPages() - 1) this.page.update((p) => p + 1);
  }

  // Select a user profile and navigate to the admin view of that profile
  viewProfile(user: UserProfile) {
    this.adminService.selectedProfile.set(user);
    this.router.navigate(['admin-profile-view', user.user_id]);
  }

  // Helper function to retrieve the full country name by country code
  countryName(code: string): string {
    return COUNTRIES.find((c) => c.code === code)?.name ?? code;
  }

  // ------ Filter state and logic------

  // --- Gender filters
  readonly allGenders = ['male', 'female', 'other'] as const;
  readonly genderOptions: DropdownOption[] = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];
  // The genders currently selected in the filter dropdown (not yet applied)
  pendingGenders = signal<Set<string>>(new Set());

  toggleGender(gender: string) {
    this.pendingGenders.update((set) => {
      const next = new Set(set);
      next.has(gender) ? next.delete(gender) : next.add(gender);
      return next;
    });
  }

  genderFilterLabel(): string {
    const applied = this.adminService.genders;
    if (!applied || applied.length === 0) return 'All genders';
    return applied.map((g: string) => g.charAt(0).toUpperCase() + g.slice(1)).join(', ');
  }

  // --- Exact age filter
  pendingExactAge = signal<number | null>(null);
  exactAgeFormControl = new FormControl(null, [
    Validators.min(18),
    Validators.max(120),
    Validators.pattern(/^\d*$/),
  ]);

  // --- Age range filter (sliders)
  readonly minAgeBound = 18;
  readonly maxAgeBound = 120;
  pendingMinAge = signal(18);
  pendingMaxAge = signal(120);

  // --- Place of residence filter
  // This is a free-form text input
  pendingPlaceOfResidence = signal('');
  placeOfResidenceFormControl = new FormControl('', [Validators.maxLength(100)]);

  // --- Country filter
  readonly countryOptions: DropdownOption[] = COUNTRIES.map((c) => ({
    label: c.name,
    value: c.code,
  }));
  // The country currently selected in the filter dropdown (not yet applied)
  pendingCountry = signal<Set<string>>(new Set());

  applyFilters() {
    const genders = this.pendingGenders();
    this.adminService.genders = genders.size > 0 ? ([...genders] as any) : null;
    const exactAge = this.pendingExactAge();
    this.adminService.exactAge = exactAge !== null ? exactAge : null;
    const minAge = this.pendingMinAge();
    const maxAge = this.pendingMaxAge();
    this.adminService.minAge = minAge !== this.minAgeBound ? minAge : null;
    this.adminService.maxAge = maxAge !== this.maxAgeBound ? maxAge : null;
    const place = this.pendingPlaceOfResidence();
    this.adminService.placeOfResidence = place.trim() !== '' ? place.trim() : null;
    const country = [...this.pendingCountry()][0] ?? null;
    this.adminService.countryOfOrigin = country;
    this.page.set(0);
    this.adminService.fetchUserProfiles();
  }

  clearFilters() {
    this.pendingGenders.set(new Set());
    this.pendingExactAge.set(null);
    this.exactAgeFormControl.reset();
    this.pendingMinAge.set(this.minAgeBound);
    this.pendingMaxAge.set(this.maxAgeBound);
    this.pendingPlaceOfResidence.set('');
    this.placeOfResidenceFormControl.reset();
    this.pendingCountry.set(new Set());
    this.applyFilters();
  }
}
